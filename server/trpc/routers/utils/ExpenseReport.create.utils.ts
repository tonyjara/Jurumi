import type { FormExpenseReport } from '@/lib/validations/expenseReport.validate';
import type {
  ExpenseReport,
  TaxPayer,
  searchableImage,
  Prisma,
} from '@prisma/client';
import { TRPCError } from '@trpc/server';

export async function createCostCategoryTransactions({
  expenseReport,
  txCtx,
}: {
  expenseReport: ExpenseReport & {
    account: {
      id: string;
    };
    taxPayer: TaxPayer;
    searchableImage: searchableImage | null;
  };
  txCtx: Prisma.TransactionClient;
}) {
  if (!expenseReport.projectId || !expenseReport.costCategoryId) return;

  const costCategoryId = expenseReport.costCategoryId;

  // 1. Get latest transaction of the money Account
  const getLastestCostCatWithTx = await txCtx.costCategory.findUniqueOrThrow({
    where: { id: costCategoryId },
    include: { transactions: { take: 1, orderBy: { id: 'desc' } } },
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
      transactionType: 'COST_CATEGORY',
      expenseReportId: expenseReport.id,
      moneyRequestId: expenseReport.moneyRequestId,
      searchableImage: expenseReport.searchableImage?.imageName.length
        ? {
            connect: {
              id: expenseReport.searchableImage.id,
            },
          }
        : {},
    },
  });
}

export const createExpenseReportProof = async ({
  input,
}: {
  input: FormExpenseReport;
}) => {
  if (!input.searchableImage) {
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'no imbursement proof',
    });
  }
  const imbursementProof = await prisma?.searchableImage.upsert({
    where: {
      imageName: input.searchableImage?.imageName,
    },
    create: {
      url: input.searchableImage.url,
      imageName: input.searchableImage.imageName,
      text: '',
    },
    update: {},
  });

  return imbursementProof;
};
