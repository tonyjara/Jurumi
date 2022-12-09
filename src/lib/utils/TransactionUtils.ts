import type { Transaction } from '@prisma/client';
import { Prisma } from '@prisma/client';

export const reduceTransactionAmounts = (x: Transaction[]) => {
  return x.reduce((acc, t) => {
    return acc.add(t.transactionAmount);
  }, new Prisma.Decimal(0));
};
