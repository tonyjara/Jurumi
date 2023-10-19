import type { CostCategory, Currency } from '@prisma/client';
import { Prisma } from '@prisma/client';
import Decimal from 'decimal.js';

export const projectExecutedAmount = ({
  costCats,
}: {
  costCats: (CostCategory & {
    transactions: {
      currency: Currency;
      openingBalance: Prisma.Decimal;
      currentBalance: Prisma.Decimal;
      transactionAmount: Prisma.Decimal;
    }[];
  })[];
}) => {
  let gs = new Prisma.Decimal(0);
  let usd = new Prisma.Decimal(0);
  for (const costCat of costCats) {
    const lastTx = costCat.transactions[0];
    // if (!costCat.transactions.length || !lastTx) continue;

    if (lastTx?.currency === 'PYG') gs = gs.add(lastTx.currentBalance);
    if (lastTx?.currency === 'USD') usd = usd.add(lastTx.currentBalance);
  }

  return { gs, usd };
};

export const projectDisbursedAmount = ({
  transactions,
}: {
  transactions: {
    openingBalance: Decimal;
    currency: Currency;
    currentBalance: Decimal;
    transactionAmount: Decimal;
  }[];
}) => {
  const lastTx = transactions[0];

  return lastTx ? lastTx.currentBalance : new Prisma.Decimal(0);
};

export const generateAcronym = (name: string) =>
  name
    .split(' ')
    .map((x) => x[0]?.toUpperCase())
    .join('');
