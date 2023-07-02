import type { BankAccsWithLastTx } from "@/components/OrgCharts/CardGroups/BankAcc.cardGroup";
import type { CashAccsWithLastTx } from "@/components/OrgCharts/CardGroups/PettyCash.cardGroup";
import {
  Currency,
  ExpenseReport,
  ExpenseReturn,
  Transaction,
} from "@prisma/client";
import { Prisma } from "@prisma/client";

import type { TransactionField } from "../validations/transaction.create.validate";
import { decimalFormat } from "./DecimalHelpers";

// Transaction utils for FRONTEND

export const reduceTransactionAmountsToSetCurrency = ({
  transactions,
  currency,
}: {
  transactions?: Transaction[];
  currency?: Currency;
}) => {
  const x = transactions;
  if (!x || !currency) return new Prisma.Decimal(0);

  return x.reduce((acc, t) => {
    if (t.transactionType !== "MONEY_ACCOUNT") return acc;

    if (currency !== t.currency) {
      if (t.currency === "USD") {
        return acc.add(t.transactionAmount.mul(t.exchangeRate));
      }
      return acc.add(t.transactionAmount.div(t.exchangeRate));
    }
    return acc.add(t.transactionAmount);
  }, new Prisma.Decimal(0));
};

export const reduceExpenseReportsToSetCurrency = ({
  expenseReports,
  currency,
}: {
  expenseReports?: ExpenseReport[];
  currency: Currency;
}) => {
  return (expenseReports ?? []).reduce((acc, e) => {
    if (currency !== e.currency) {
      if (e.currency === "USD") {
        return acc.add(e.amountSpent.mul(e.exchangeRate));
      }
      return acc.add(e.amountSpent.div(e.exchangeRate));
    }
    return acc.add(e.amountSpent);
  }, new Prisma.Decimal(0));
};

export const reduceExpenseReturnsToSetCurrency = ({
  expenseReturns,
  currency,
}: {
  expenseReturns?: ExpenseReturn[];
  currency: Currency;
}) => {
  return (expenseReturns ?? []).reduce((acc, e) => {
    if (currency !== e.currency) {
      if (e.currency === "USD") {
        return acc.add(e.amountReturned.mul(e.exchangeRate));
      }
      return acc.add(e.amountReturned.div(e.exchangeRate));
    }
    return acc.add(e.amountReturned);
  }, new Prisma.Decimal(0));
};

export const reduceTransactionFieldsToSetCurrency = (
  x: TransactionField[],
  y: Currency
) => {
  return x.reduce((acc, t) => {
    if (!t.transactionAmount.isInt) return acc;
    if (t.currency !== y) {
      if (t.currency === "USD") {
        return acc.add(t.transactionAmount.times(t.exchangeRate));
      }

      if (t.currency === "PYG") {
        return acc.add(t.transactionAmount.dividedBy(t.exchangeRate));
      }
    }

    return acc.add(t.transactionAmount);
  }, new Prisma.Decimal(0));
};

export const formatedAccountBalance = (
  acc: BankAccsWithLastTx | CashAccsWithLastTx
) => {
  if (acc?.transactions?.length) {
    const lastT = acc.transactions[0];

    if (!lastT?.currentBalance) return "Error";
    return decimalFormat(lastT?.currentBalance, acc.currency);
  }

  return decimalFormat(acc.initialBalance, acc.currency);
};
