import type { FormExpenseReport } from "@/lib/validations/expenseReport.validate";
import type {
  ExpenseReport,
  TaxPayer,
  searchableImage,
  Prisma,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import prisma from "@/server/db/client";
import {
  FormMoneyRequest,
  MoneyReqSearchableImage,
} from "@/lib/validations/moneyRequest.validate";
import { appRouter } from "../router";
import { Session } from "next-auth";
import Decimal from "decimal.js";
import { decimalFormat } from "@/lib/utils/DecimalHelpers";

export type CreateCostCategoryTransactionsType = ExpenseReport & {
  account: {
    id: string;
  };
  taxPayer: TaxPayer;
  searchableImage: { imageName: string } | null;
};

export async function createCostCategoryTransactions({
  expenseReport,
  txCtx,
}: {
  expenseReport: CreateCostCategoryTransactionsType;
  txCtx: Prisma.TransactionClient;
}) {
  //If it doesn't have a project or cost category, don't create a transaction
  if (!expenseReport.projectId || !expenseReport.costCategoryId) return;

  const costCategoryId = expenseReport.costCategoryId;

  // 1. Get latest transaction of the money Account
  const getLastestCostCatWithTx = await txCtx.costCategory.findUniqueOrThrow({
    where: { id: costCategoryId },
    include: { transactions: { take: 1, orderBy: { id: "desc" } } },
  });

  // 2. If it's the first transaction, opening balance is always 0

  const lastTx = getLastestCostCatWithTx?.transactions[0];

  const openingBalance = lastTx ? lastTx.currentBalance : 0;

  const currentBalance = lastTx
    ? lastTx.currentBalance.add(expenseReport.amountSpent)
    : expenseReport.amountSpent;

  await txCtx.transaction.create({
    data: {
      transactionAmount: expenseReport.amountSpent,
      accountId: expenseReport.accountId,
      currency: expenseReport.currency,
      openingBalance: openingBalance,
      currentBalance: currentBalance,
      costCategoryId,
      projectId: expenseReport.projectId,
      transactionType: "COST_CATEGORY",
      expenseReportId: expenseReport.id,
      moneyRequestId: expenseReport.moneyRequestId,
      searchableImage: expenseReport.searchableImage?.imageName.length
        ? {
            connect: {
              imageName: expenseReport.searchableImage.imageName,
            },
          }
        : {},
    },
  });
}

export const upsertExpenseReportSearchableImage = async ({
  input,
}: {
  input: FormExpenseReport;
}): Promise<searchableImage | never> => {
  if (!input.searchableImage) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "no imbursement proof",
    });
  }
  const imbursementProof = await prisma?.searchableImage.upsert({
    where: {
      imageName: input.searchableImage?.imageName,
    },
    create: {
      accountId: input.accountId,
      url: input.searchableImage.url,
      imageName: input.searchableImage.imageName,
      text: "",
    },
    update: {},
  });

  return imbursementProof;
};

/** This function creates a reimbursement request whenever the amount of the expense report exceeds the total of the fund request. */
export const createReimbursementRequestBasedOnExpenseReport = async ({
  input,
  ctx,
  expenseReport,
}: {
  input: FormExpenseReport;
  ctx: { session: Session };
  expenseReport: ExpenseReport & {
    account: {
      id: string;
    };
    taxPayer: TaxPayer;
    searchableImage: searchableImage | null;
  };
}) => {
  if (
    !input.spentAmountIsGraterThanMoneyRequest ||
    !input.reimburseTo ||
    !input.pendingAmount ||
    !expenseReport.searchableImage ||
    !expenseReport.searchableImage.url ||
    !expenseReport.searchableImage.imageName
  )
    return;
  const user = ctx.session.user;
  const caller = appRouter.createCaller({ session: ctx.session });

  const preferences = await prisma.preferences.findUniqueOrThrow({
    where: { accountId: user.id },
  });

  const pendingAmount = input.pendingAmount as Decimal;
  const formatedPendingAmount = decimalFormat(pendingAmount, input.currency);
  //Patch for when a expensereport exceeds the total of the money request
  const difference =
    input.amountSpent.sub(pendingAmount).toNumber() === 0
      ? input.amountSpent
      : input.amountSpent.sub(pendingAmount);
  const formattedDifference = decimalFormat(difference, input.currency);
  const formattedAmountSpent = decimalFormat(input.amountSpent, input.currency);

  const defaultReimbursementOrderSearchableImage: MoneyReqSearchableImage = {
    url: expenseReport.searchableImage?.url,
    imageName: expenseReport.searchableImage?.imageName,
    facturaNumber: input.facturaNumber,
    amount: difference,
    currency: input.currency,
  };

  const reimbursementRequest: FormMoneyRequest = {
    id: "",
    comments: "",
    createdAt: new Date(),
    operationDate: new Date(),
    contractsId: null,
    updatedAt: null,
    description: `Esta solicitud fue creada automáticamente en base a la rendición de gastos con código: ${expenseReport.id} . El valor pendiente para llegar al total de la solicitud de fondos al momento de la creación de esta rendición fue de ${formatedPendingAmount} . El monto rendido fue de ${formattedAmountSpent}, siendo asi la diferencia entre ambos de ${formattedDifference}`,
    status: "PENDING",
    moneyRequestType: "REIMBURSMENT_ORDER",
    currency: "PYG",
    approvalStatus: "PENDING",
    amountRequested: difference,
    moneyOrderNumber: null,
    costCategoryId: input.costCategoryId,
    accountId: "",
    projectId: input.projectId,
    archived: false,
    softDeleted: false,
    rejectionMessage: "",
    organizationId: preferences.selectedOrganization,
    wasCancelled: false,
    taxPayer: input.reimburseTo,
    facturaNumber: input.facturaNumber,
    searchableImages: [defaultReimbursementOrderSearchableImage],
  };

  await caller.moneyRequest.create(reimbursementRequest);
};
