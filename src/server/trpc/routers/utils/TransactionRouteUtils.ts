import type { Transaction } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { string } from 'zod';
import type { FormTransaction } from '../../../../lib/validations/transaction.create.validate';

export async function createManyMoneyAccountTransactions({
  accountId,
  formTransaction,
}: {
  formTransaction: FormTransaction;
  accountId: string;
}) {
  return await prisma?.$transaction(async (txCtx) => {
    const operations: Transaction[] = [];
    for (const tx of formTransaction.transactions) {
      const moneyAccountId = tx.moneyAccountId;

      // 1. Get latest transaction of the bank Account
      const getLatestTx = await txCtx.moneyAccount.findUnique({
        where: { id: moneyAccountId },
        include: { transactions: { take: 1, orderBy: { id: 'desc' } } },
      });
      if (!getLatestTx) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No money request or transaction.',
        });
      }

      const lastTx = getLatestTx?.transactions[0];

      // 2. Calculate balance substracting from opening balance
      // If there are no transactions take the money account initial balance
      const currentBalance = lastTx
        ? lastTx.openingBalance.sub(lastTx.transactionAmount)
        : getLatestTx.initialBalance;

      const operation = await txCtx.transaction.create({
        data: {
          transactionAmount: tx.transactionAmount,
          accountId,
          currency: tx.currency,
          openingBalance: currentBalance,
          moneyAccountId,
          transactionProofUrl: tx.transactionProofUrl,
          moneyRequestId: formTransaction.moneyRequestId,
          imbursementId: formTransaction.imbursementId,
          expenseReturnId: formTransaction.expenseReturnId,
        },
      });

      operations.push(operation);
    }
    return operations;
  });
}

export async function checkIfIsLastTransaction({
  moneyAccountId,
  transactionId,
}: {
  moneyAccountId: string;
  transactionId: number;
}) {
  const lastTransactionFromMoneyAcc = await prisma?.moneyAccount.findUnique({
    where: { id: moneyAccountId },

    select: { transactions: { take: 1, orderBy: { id: 'desc' } } },
  });
  const latestTransactionId = lastTransactionFromMoneyAcc?.transactions[0]?.id;

  if (latestTransactionId && latestTransactionId !== transactionId) {
    //reject the requests if there is a newer record. See 'Constraints' in docs.
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'New record already exists.',
    });
  }
}
