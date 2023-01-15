import type { CostCategory, Currency } from '@prisma/client';
import { Prisma } from '@prisma/client';

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
  const gs = new Prisma.Decimal(0);
  const usd = new Prisma.Decimal(0);
  for (const costCat of costCats) {
    if (!costCat.transactions.length) continue;
    const lastTx = costCat.transactions[0];
    if (lastTx?.currency === 'PYG') gs.add(lastTx.currentBalance);
    if (lastTx?.currency === 'USD') usd.add(lastTx.currentBalance);
  }

  return { gs, usd };
};
