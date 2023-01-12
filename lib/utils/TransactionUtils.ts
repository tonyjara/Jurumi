import type { BankAccsWithLastTx } from '@/components/OrgCharts/CardGroups/BankAcc.cardGroup';
import type { CashAccsWithLastTx } from '@/components/OrgCharts/CardGroups/PettyCash.cardGroup';
import type { ExpenseReport, Transaction } from '@prisma/client';
import { Prisma } from '@prisma/client';

import type { TransactionField } from '../validations/transaction.create.validate';
import { decimalFormat } from './DecimalHelpers';

// Transaction utils for FRONTEND

export const reduceTransactionAmounts = (x?: Transaction[]) => {
  if (!x) return new Prisma.Decimal(0);
  return x.reduce((acc, t) => {
    return acc.add(t.transactionAmount);
  }, new Prisma.Decimal(0));
};

export const reduceExpenseReports = (x?: ExpenseReport[]) => {
  if (!x) return new Prisma.Decimal(0);
  return x.reduce((acc, t) => {
    return acc.add(t.amountSpent);
  }, new Prisma.Decimal(0));
};
export const reduceTransactionFields = (x: TransactionField[]) => {
  return x.reduce((acc, t) => {
    return acc.add(t.transactionAmount);
  }, new Prisma.Decimal(0));
};

export const formatedAccountBalance = (
  acc: BankAccsWithLastTx | CashAccsWithLastTx
) => {
  if (acc?.transactions?.length) {
    const lastT = acc.transactions[0];

    if (!lastT?.currentBalance) return 'Error';
    return decimalFormat(lastT?.currentBalance, acc.currency);
  }

  return decimalFormat(acc.initialBalance, acc.currency);
};
