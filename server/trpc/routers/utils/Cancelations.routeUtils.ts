import type {
  ExpenseReport,
  ExpenseReturn,
  MoneyRequestApproval,
  Transaction,
} from "@prisma/client";
import { Prisma } from "@prisma/client";

export const cancelTransactionsAndRevertBalance = async ({
  txCtx,
  transactions,
}: {
  txCtx: Prisma.TransactionClient;
  transactions: Transaction[];
}) => {
  //Creates new cancellation and conencts to last relevant transaction, so that they have a one to one relation.
  if (!transactions.length) return;
  //get the last transaction that affected the money account
  for (const tx of transactions) {
    const getLastTx = async () => {
      if (tx.transactionType === "COST_CATEGORY") {
        return await txCtx.transaction.findFirstOrThrow({
          where: {
            costCategoryId: tx.costCategoryId,
            transactionType: "COST_CATEGORY",
          },
          orderBy: { id: "desc" },
        });
      }

      if (tx.transactionType === "PROJECT_IMBURSEMENT") {
        return await txCtx.transaction.findFirstOrThrow({
          where: {
            projectId: tx.projectId,
            transactionType: "PROJECT_IMBURSEMENT",
          },
          orderBy: { id: "desc" },
        });
      }

      return await txCtx.transaction.findFirstOrThrow({
        where: {
          moneyAccountId: tx.moneyAccountId,
          transactionType: { not: "COST_CATEGORY" },
        },
        orderBy: { id: "desc" },
      });
    };

    const lastTx = await getLastTx();

    const balanceAfterCancellation = () => {
      if (tx.transactionType === "MONEY_ACCOUNT") {
        return lastTx.currentBalance.add(tx.transactionAmount);
      }

      return lastTx.currentBalance.sub(tx.transactionAmount);
    };

    const cancellation = await txCtx.transaction.create({
      data: {
        isCancellation: true,
        accountId: tx.accountId,
        currency: tx.currency,
        cancellationId: tx.id,
        transactionAmount: tx.transactionAmount,
        openingBalance: lastTx.currentBalance,
        currentBalance: balanceAfterCancellation(),
        moneyAccountId: tx.moneyAccountId,
        moneyRequestId: tx.moneyRequestId,
        imbursementId: tx.imbursementId,
        expenseReturnId: tx.expenseReturnId,
        projectId: tx.projectId,
        transactionType: tx.transactionType,
        costCategoryId: tx.costCategoryId,
        expenseReportId: tx.expenseReportId,
        moneyAccountOffsetId: tx.moneyAccountOffsetId,
        // do not need searchable image in a cancellation.
      },
    });

    // attach id to cancelled transaction
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
  expenseReturns: ExpenseReturn[];
}) => {
  if (!expenseReturns.length) return;

  for (const expRet of expenseReturns) {
    await txCtx.expenseReturn.update({
      where: { id: expRet.id },
      data: {
        wasCancelled: true,
      },
    });
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
