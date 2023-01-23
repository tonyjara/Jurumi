import type {
  ExpenseReport,
  ExpenseReturn,
  MoneyRequestApproval,
  Prisma,
  Transaction,
} from '@prisma/client';
import { TRPCError } from '@trpc/server';

export const cancelTransactions = async ({
  txCtx,
  transactions,
}: {
  txCtx: Prisma.TransactionClient;
  transactions: Transaction[];
}) => {
  //Creates new cancellation and conencts to last relevant transaction, so that they have a one to one relation.
  if (!transactions.length) return;
  for (const tx of transactions) {
    const getLastTx = async () => {
      if (tx.transactionType === 'MONEY_ACCOUNT') {
        return await txCtx.transaction.findFirst({
          where: {
            moneyAccountId: tx.moneyAccountId,
            transactionType: 'MONEY_ACCOUNT',
          },
          orderBy: { id: 'desc' },
        });
      }
      if (tx.transactionType === 'COST_CATEGORY') {
        return await txCtx.transaction.findFirst({
          where: {
            costCategoryId: tx.costCategoryId,
            transactionType: 'COST_CATEGORY',
          },
          orderBy: { id: 'desc' },
        });
      }
      if (tx.transactionType === 'PROJECT_IMBURSEMENT') {
        return await txCtx.transaction.findFirst({
          where: {
            projectId: tx.projectId,
            transactionType: 'PROJECT_IMBURSEMENT',
          },
          orderBy: { id: 'desc' },
        });
      }

      return null;
    };
    const lastTx = await getLastTx();

    if (!lastTx) {
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'no transaction found',
      });
    }

    //last tx is used for current opening balance, then the cancellation amount is substracted
    const cancellation = await txCtx.transaction.create({
      data: {
        isCancellation: true,
        accountId: tx.accountId,
        currency: tx.currency,
        //reversing amounts
        transactionAmount: tx.transactionAmount,
        openingBalance: lastTx.currentBalance,
        currentBalance: lastTx.currentBalance.sub(tx.transactionAmount),
        moneyAccountId: tx.moneyAccountId,
        moneyRequestId: tx.moneyRequestId,
        imbursementId: tx.imbursementId,
        expenseReturnId: tx.expenseReturnId,
        cancellationId: tx.id,
        projectId: tx.projectId,
        transactionType: tx.transactionType,
        costCategoryId: tx.costCategoryId,
        // do not need searchable image in a cancellation.
      },
    });

    await txCtx.transaction.update({
      where: { id: tx.id },
      data: {
        cancellationId: cancellation.id,
      },
    });
  }
};

export const cancelExpenseReports = async ({
  txCtx,
  expenseReports,
}: {
  txCtx: Prisma.TransactionClient;
  expenseReports: ExpenseReport[];
}) => {
  if (!expenseReports.length) return;

  for (const exRep of expenseReports) {
    await txCtx.expenseReport.update({
      where: { id: exRep.id },
      data: {
        wasCancelled: true,
      },
    });
  }
};
export const cancelExpenseReturns = async ({
  txCtx,
  expenseReturns,
}: {
  txCtx: Prisma.TransactionClient;
  expenseReturns: (ExpenseReturn & {
    transactions: Transaction[];
  })[];
}) => {
  if (!expenseReturns.length) return;

  for (const expRet of expenseReturns) {
    await txCtx.expenseReport.update({
      where: { id: expRet.id },
      data: {
        wasCancelled: true,
      },
    });

    await cancelTransactions({ txCtx, transactions: expRet.transactions });
  }
};

export const cancelMoneyReqApprovals = async ({
  txCtx,
  moneyRequestApprovals,
}: {
  txCtx: Prisma.TransactionClient;
  moneyRequestApprovals: MoneyRequestApproval[];
}) => {
  if (!moneyRequestApprovals.length) return;

  for (const reqApproval of moneyRequestApprovals) {
    await txCtx.moneyRequestApproval.update({
      where: { id: reqApproval.id },
      data: {
        wasCancelled: true,
      },
    });
  }
};
