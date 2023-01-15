import type { CostCategory, Currency } from '@prisma/client';
import { Prisma } from '@prisma/client';
export const reduceCostCatAsignedAmount = ({
  costCats,
  currency,
}: {
  costCats: CostCategory[];
  currency: Currency;
}) => {
  return costCats.reduce((acc, val) => {
    if (val.currency === currency) {
      return acc.add(val.assignedAmount);
    }

    return acc;
  }, new Prisma.Decimal(0));
};
