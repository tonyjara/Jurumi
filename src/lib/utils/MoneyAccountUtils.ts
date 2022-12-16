import type { Currency } from '@prisma/client';
import { Prisma } from '@prisma/client';
import type { MoneyAccWithTransactions } from '../../pageContainers/mod.money-accounts/MoneyAccountsPage.mod.money-accounts';

export const reduceMoneyAccountValues = (
  moneyAccs: MoneyAccWithTransactions[],
  currency: Currency
) => {
  return moneyAccs.reduce((acc, cashAcc) => {
    if (cashAcc.currency === currency) {
      const lastTx = cashAcc.transactions[0];
      if (lastTx?.currency !== currency) return acc;

      return acc.add(lastTx.openingBalance.sub(lastTx.transactionAmount));
    }
    return acc;
  }, new Prisma.Decimal(0));
};
