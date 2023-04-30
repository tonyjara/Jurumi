import type { FormExpenseReturn } from "@/lib/validations/expenseReturn.validate";
import type { ExpenseReturn, Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import prisma from "@/server/db/client";

const createMoneyAccountTx = async ({
  txCtx,
  expenseReturn,
  accountId,
}: {
  txCtx: Prisma.TransactionClient;
  expenseReturn: ExpenseReturn & {
    searchableImage: {
      id: string;
    } | null;
  };
  accountId: string;
}) => {
  if (!expenseReturn.moneyAccountId) return;

  // 2. Get latest transaction of the bank Account
  const getMoneyAccAndLatestTx = await txCtx.moneyAccount.findUniqueOrThrow({
    where: { id: expenseReturn.moneyAccountId },
    include: { transactions: { take: 1, orderBy: { id: "desc" } } },
  });

  const transactionAmount = expenseReturn.amountReturned;
  const lastTx = getMoneyAccAndLatestTx?.transactions[0];
  const openingBalance = lastTx
    ? lastTx.currentBalance
    : getMoneyAccAndLatestTx.initialBalance;
  const currentBalance = lastTx
    ? lastTx.currentBalance.add(transactionAmount)
    : getMoneyAccAndLatestTx.initialBalance.add(transactionAmount);

  await txCtx.transaction.create({
    data: {
      accountId,
      currency: expenseReturn.currency,
      transactionAmount,
      openingBalance: openingBalance,
      currentBalance: currentBalance,
      moneyAccountId: expenseReturn.moneyAccountId,
      moneyRequestId: expenseReturn.moneyRequestId,
      transactionType: "EXPENSE_RETURN",
      expenseReturnId: expenseReturn.id,
      searchableImage: expenseReturn.searchableImage?.id
        ? { connect: { id: expenseReturn.searchableImage?.id } }
        : {},
    },
  });
};

const createExpenseReportProof = async ({
  input,
  txCtx,
}: {
  input: FormExpenseReturn;
  txCtx: Prisma.TransactionClient;
}) => {
  if (!input.searchableImage) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "no image proof",
    });
  }
  const imageProof = await txCtx?.searchableImage.upsert({
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

  return imageProof;
};

export const expenseReturnCreateUtils = {
  createMoneyAccountTx,
  createExpenseReportProof,
};
