import type { FormImbursement } from "@/lib/validations/imbursement.validate";
import type { Imbursement, searchableImage, TaxPayer } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import prisma from "@/server/db/client";

const createMoneyAccountTx = async ({
  txCtx,
  imbursement,
  input,
  accountId,
}: {
  txCtx: Prisma.TransactionClient;
  input: FormImbursement;
  imbursement: Imbursement & {
    imbursementProof: {
      id: string;
    } | null;
  };
  accountId: string;
}) => {
  if (!input.moneyAccountId) return;

  // 2. Get latest transaction of the bank Account
  const getMoneyAccAndLatestTx = await txCtx.moneyAccount.findUnique({
    where: { id: input.moneyAccountId },
    include: { transactions: { take: 1, orderBy: { id: "desc" } } },
  });

  if (!getMoneyAccAndLatestTx) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No money request or transaction.",
    });
  }
  // 3. Calculate balance based on transaction or initialbalance
  const transactionAmount = input.wasConvertedToOtherCurrency
    ? input.finalAmount
    : input.amountInOtherCurrency;
  const lastTx = getMoneyAccAndLatestTx?.transactions[0];
  const openingBalance = lastTx
    ? lastTx.currentBalance
    : getMoneyAccAndLatestTx.initialBalance;
  const currentBalance = lastTx
    ? lastTx.currentBalance.add(transactionAmount)
    : getMoneyAccAndLatestTx.initialBalance.add(transactionAmount);

  // 4. Create transaction, add values dependant of conversion
  await txCtx.transaction.create({
    data: {
      transactionAmount,
      accountId,
      currency: input.wasConvertedToOtherCurrency
        ? input.finalCurrency
        : input.otherCurrency,
      openingBalance: openingBalance,
      currentBalance: currentBalance,
      moneyAccountId: input.moneyAccountId,
      transactionType: "MONEY_ACCOUNT",
      imbursementId: imbursement.id,
      searchableImage: imbursement.imbursementProof?.id
        ? { connect: { id: imbursement.imbursementProof?.id } }
        : {},
    },
  });
};

const createProjectImbursementTx = async ({
  txCtx,
  imbursement,
  input,
  accountId,
  taxPayer,
}: {
  txCtx: Prisma.TransactionClient;
  input: FormImbursement;
  imbursement: Imbursement & {
    imbursementProof: {
      id: string;
    } | null;
  };
  accountId: string;
  taxPayer: TaxPayer;
}) => {
  if (!input.projectId) return;

  //connect taxpayer to project as a donor.
  await txCtx.project.update({
    where: { id: input.projectId },
    data: {
      taxPayer: { connect: { id: taxPayer.id } },
    },
  });

  // 2. Get latest project transaction
  const projectWithTxs = await txCtx.project.findUnique({
    where: { id: input.projectId },
    include: {
      transactions: {
        where: {
          projectId: input.projectId,
          transactionType: "PROJECT_IMBURSEMENT",
        },
        take: 1,
        orderBy: { id: "desc" },
      },
    },
  });

  // 3. Calculate balance based on transaction or initialbalance
  const transactionAmount = input.wasConvertedToOtherCurrency
    ? input.finalAmount
    : input.amountInOtherCurrency;
  const lastTx = projectWithTxs?.transactions[0];
  const openingBalance = lastTx ? lastTx.currentBalance : new Prisma.Decimal(0);
  const currentBalance = lastTx
    ? lastTx.currentBalance.add(transactionAmount)
    : transactionAmount;

  // 4. Create transaction, add values dependant of conversion
  await txCtx.transaction.create({
    data: {
      transactionAmount,
      accountId,
      currency: input.wasConvertedToOtherCurrency
        ? input.finalCurrency
        : input.otherCurrency,
      openingBalance: openingBalance,
      currentBalance: currentBalance,
      projectId: input.projectId,
      transactionType: "PROJECT_IMBURSEMENT",
      imbursementId: imbursement.id,
      searchableImage: imbursement.imbursementProof?.id
        ? { connect: { id: imbursement.imbursementProof?.id } }
        : {},
    },
  });
};

const createInvoiceFromOrg = async ({ input }: { input: FormImbursement }) => {
  if (!input.invoiceFromOrg?.imageName.length) return null;

  return await prisma?.searchableImage.upsert({
    where: {
      imageName: input.invoiceFromOrg?.imageName,
    },
    create: {
      accountId: input.accountId,
      url: input.invoiceFromOrg.url,
      imageName: input.invoiceFromOrg.imageName,
      text: "",
    },
    update: {},
  });
};
const createImbursementProof = async ({
  input,
}: {
  input: FormImbursement;
}) => {
  if (!input.imbursementProof) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "no imbursement proof",
    });
  }
  const imbursementProof = await prisma?.searchableImage.upsert({
    where: {
      imageName: input.imbursementProof?.imageName,
    },
    create: {
      accountId: input.accountId,
      url: input.imbursementProof.url,
      imageName: input.imbursementProof.imageName,
      text: "",
    },
    update: {},
  });

  return imbursementProof;
};

const createImbursement = async ({
  txCtx,
  invoiceFromOrg,
  accountId,
  input,
  taxPayer,
  imbursementProof,
}: {
  txCtx: Prisma.TransactionClient;
  accountId: string;
  input: FormImbursement;
  taxPayer: TaxPayer;
  imbursementProof: searchableImage | undefined;
  invoiceFromOrg: searchableImage | null | undefined;
}) => {
  if (!imbursementProof) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "no imbursement proof",
    });
  }
  const imbursement = await txCtx?.imbursement.create({
    data: {
      accountId,
      concept: input.concept,
      projectId: input.projectId,
      wasConvertedToOtherCurrency: input.wasConvertedToOtherCurrency,
      exchangeRate: input.exchangeRate,
      otherCurrency: input.otherCurrency,
      amountInOtherCurrency: input.amountInOtherCurrency,
      finalCurrency: input.finalCurrency,
      finalAmount: input.finalAmount,
      moneyAccountId: input.moneyAccountId,
      taxPayerId: taxPayer.id,
      imbursementProofId: imbursementProof.id,
      invoiceFromOrgId: invoiceFromOrg?.id ?? null,
    },
    include: { imbursementProof: { select: { id: true } } },
  });
  return imbursement;
};

const upsertTaxPayter = async ({
  input,
  userId,
}: {
  input: FormImbursement;
  userId: string;
}) => {
  const taxPayer = await prisma?.taxPayer.upsert({
    where: {
      ruc: input.taxPayer.ruc,
    },
    create: {
      createdById: userId,
      razonSocial: input.taxPayer.razonSocial,
      ruc: input.taxPayer.ruc,
    },
    update: {},
  });
  return taxPayer;
};

export const imbursementCreateUtils = {
  createMoneyAccountTx,
  createProjectImbursementTx,
  createInvoiceFromOrg,
  createImbursement,
  createImbursementProof,
  upsertTaxPayter,
};
