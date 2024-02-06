import type { BankAccsWithLastTx } from "@/components/OrgCharts/CardGroups/BankAcc.cardGroup";
import type { CashAccsWithLastTx } from "@/components/OrgCharts/CardGroups/PettyCash.cardGroup";
import type { Currency } from "@prisma/client";
import { Prisma } from "@prisma/client";

export const reduceBankAccValues = (
  moneyAccs: BankAccsWithLastTx[],
  currency: Currency,
) => {
  return moneyAccs.reduce((acc, moneyAcc) => {
    if (moneyAcc.currency === currency) {
      const lastTx = moneyAcc.transactions[0];
      if (lastTx?.currency !== currency) return acc;

      return acc.add(lastTx.openingBalance.sub(lastTx.transactionAmount));
    }
    return acc;
  }, new Prisma.Decimal(0));
};
export const reduceCashAccValues = (
  moneyAccs: CashAccsWithLastTx[],
  currency: Currency,
) => {
  return moneyAccs.reduce((acc, moneyAcc) => {
    if (moneyAcc.currency === currency) {
      const lastTx = moneyAcc.transactions[0];
      if (lastTx?.currency !== currency) return acc;

      return acc.add(lastTx.openingBalance.sub(lastTx.transactionAmount));
    }
    return acc;
  }, new Prisma.Decimal(0));
};
