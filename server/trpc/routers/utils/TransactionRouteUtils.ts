import type { Account, Transaction } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import type { FormTransactionCreate } from '@/lib/validations/transaction.create.validate';
import { getSelectedOrganizationId } from './PreferencesRoutUtils';

export async function createManyMoneyAccountTransactions({
  accountId,
  formTransaction,
}: {
  formTransaction: FormTransactionCreate;
  accountId: string;
}) {
  return await prisma?.$transaction(async (txCtx) => {
    const operations: Transaction[] = [];
    for (const tx of formTransaction.transactions) {
      const moneyAccountId = tx.moneyAccountId;

      // 1. Get latest transaction of the money Account
      const getMoneyAccAndLatestTx = await txCtx.moneyAccount.findUnique({
        where: { id: moneyAccountId },
        include: { transactions: { take: 1, orderBy: { id: 'desc' } } },
      });
      if (!getMoneyAccAndLatestTx) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No money request or transaction.',
        });
      }

      // 2. Calculate balance based on transaction or initialbalance

      const lastTx = getMoneyAccAndLatestTx?.transactions[0];
      const openingBalance = lastTx
        ? lastTx.currentBalance
        : getMoneyAccAndLatestTx.initialBalance;
      const currentBalance = lastTx
        ? lastTx.currentBalance.sub(tx.transactionAmount)
        : getMoneyAccAndLatestTx.initialBalance.sub(tx.transactionAmount);

      const operation = await txCtx.transaction.create({
        data: {
          transactionAmount: tx.transactionAmount,
          accountId,
          currency: tx.currency,
          openingBalance: openingBalance,
          currentBalance: currentBalance,
          moneyAccountId,
          moneyRequestId: formTransaction.moneyRequestId,
          imbursementId: formTransaction.imbursementId,
          expenseReturnId: formTransaction.expenseReturnId,
          searchableImage: formTransaction.searchableImage
            ? {
                create: {
                  url: formTransaction.searchableImage.url,
                  imageName: formTransaction.searchableImage.imageName,
                  text: '',
                },
              }
            : {},
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

export async function checkIfUserIsMoneyAdmin(user: Omit<Account, 'password'>) {
  //1. Get org id
  const getPrefs = await getSelectedOrganizationId(user);
  if (!getPrefs?.selectedOrganization) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'No org selected.',
    });
  }

  //2. Find if org has money administrators.

  const org = await prisma?.organization.findUnique({
    where: { id: getPrefs.selectedOrganization },
    include: { moneyAdministrators: { select: { id: true } } },
  });
  //3. If there are no money administrators in org then coninue
  if (org && !org.moneyAdministrators.length) return;

  //4. Check that user is part of money administrators
  if (!org?.moneyAdministrators.some((x) => x.id === user.id)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'User not money admin',
    });
  }
}
