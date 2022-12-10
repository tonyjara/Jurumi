import type { Transaction } from '@prisma/client';
import { Prisma } from '@prisma/client';
import type { TransactionField } from '../validations/transaction.create.validate';

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
