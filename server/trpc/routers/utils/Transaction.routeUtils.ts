import type { FormTransactionCreate } from '@/lib/validations/transaction.create.validate';
import type { Account, Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { getSelectedOrganizationId } from './Preferences.routeUtils';

async function checkIfIsLastTransaction({
  moneyAccountId,
  transactionId,
  costCategoryId,
}: {
  moneyAccountId: string | null;
  costCategoryId: string | null;
  transactionId: number;
}) {
  if (costCategoryId) {
    const lastTxFromCostCat = await prisma?.costCategory.findUnique({
      where: { id: costCategoryId },

      select: { transactions: { take: 1, orderBy: { id: 'desc' } } },
    });
    const latestTransactionId = lastTxFromCostCat?.transactions[0]?.id;

    if (latestTransactionId && latestTransactionId !== transactionId) {
      //reject the requests if there is a newer record. See 'Constraints' in docs.
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'New record already exists.',
      });
    }
  }
  if (moneyAccountId) {
    const lastTransactionFromMoneyAcc = await prisma?.moneyAccount.findUnique({
      where: { id: moneyAccountId },

      select: { transactions: { take: 1, orderBy: { id: 'desc' } } },
    });
    const latestTransactionId =
      lastTransactionFromMoneyAcc?.transactions[0]?.id;

    if (latestTransactionId && latestTransactionId !== transactionId) {
      //reject the requests if there is a newer record. See 'Constraints' in docs.
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'New record already exists.',
      });
    }
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

async function createCostCategoryTransactions({
  formTransaction,
  txCtx,
  accountId,
}: {
  accountId: string;
  formTransaction: FormTransactionCreate;
  txCtx: Prisma.TransactionClient;
}) {
  if (!formTransaction.projectId || !formTransaction.costCategoryId) return;
  const costCategoryId = formTransaction.costCategoryId;
  // 1. Get latest transaction of the money Account
  const getLastestCostCatWithTx = await txCtx.costCategory.findUniqueOrThrow({
    where: { id: costCategoryId },
    include: { transactions: { take: 1, orderBy: { id: 'desc' } } },
  });
  // 2. If it's the first transaction, opening balance is always 0

  const lastTx = getLastestCostCatWithTx?.transactions[0];
  const openingBalance = lastTx ? lastTx.currentBalance : 0;

  for (const tx of formTransaction.transactions) {
    const currentBalance = lastTx
      ? lastTx.currentBalance.add(tx.transactionAmount)
      : tx.transactionAmount;

    await txCtx.transaction.create({
      data: {
        transactionAmount: tx.transactionAmount,
        accountId: accountId,
        currency: tx.currency,
        openingBalance: openingBalance,
        currentBalance: currentBalance,
        costCategoryId,
        projectId: formTransaction.projectId,
        transactionType: 'COST_CATEGORY',
        moneyRequestId: formTransaction.moneyRequestId,
        searchableImage: formTransaction.searchableImage?.imageName.length
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
  }
}

export const transactionRouteUtils = {
  createCostCategoryTransactions,
  checkIfIsLastTransaction,
};
