import type { Transaction } from '@prisma/client';
import { Prisma } from '@prisma/client';
import type { MoneyAccWithTransactions } from '../../pageContainers/mod.money-accounts/MoneyAccountsPage.mod.money-accounts';
import type { TransactionField } from '../validations/transaction.create.validate';
import { decimalFormat } from './DecimalHelpers';

// Transaction utils for FRONTEND

export const reduceTransactionAmounts = (x?: Transaction[]) => {
  if (!x) return new Prisma.Decimal(0);
  return x.reduce((acc, t) => {
    return acc.add(t.transactionAmount);
  }, new Prisma.Decimal(0));
};
export const reduceTransactionFields = (x: TransactionField[]) => {
  return x.reduce((acc, t) => {
    return acc.add(t.transactionAmount);
  }, new Prisma.Decimal(0));
};

export const formatedAccountBalance = (acc: MoneyAccWithTransactions) => {
  if (acc.transactions.length) {
    const lastT = acc.transactions[0];
    const currentBalance = lastT?.openingBalance.sub(lastT.transactionAmount);
    if (!currentBalance) return 'Error';
    return decimalFormat(currentBalance, acc.currency);
  }

  return decimalFormat(acc.initialBalance, acc.currency);
};
