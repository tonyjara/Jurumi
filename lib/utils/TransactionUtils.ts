import type { BankAccsWithLastTx } from "@/components/OrgCharts/CardGroups/BankAcc.cardGroup";
import type { CashAccsWithLastTx } from "@/components/OrgCharts/CardGroups/PettyCash.cardGroup";
import { CompleteMoneyReqHome } from "@/pageContainers/home/requests/HomeRequestsPage.home.requests";
import { TransactionComplete } from "@/pageContainers/mod/transactions/transactions.types";
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
  y: Currency,
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
  acc: BankAccsWithLastTx | CashAccsWithLastTx,
) => {
  if (acc?.transactions?.length) {
    const lastT = acc.transactions[0];

    if (!lastT?.currentBalance) return "Error";
    return decimalFormat(lastT?.currentBalance, acc.currency);
  }

  return decimalFormat(acc.initialBalance, acc.currency);
};

/** Find out the pending amount from the moneyRequest based on currency and exchangeRate */
export function calculateMoneyReqPendingAmount({
  moneyRequest,
  currency,
  exchangeRate,
}: {
  moneyRequest: CompleteMoneyReqHome | undefined;
  currency: Currency;
  exchangeRate: number;
}) {
  if (!moneyRequest) return new Prisma.Decimal(0);
  const totalAmountRequested = moneyRequest.amountRequested;
  const totalAmountReportedOrReturned = reduceExpenseReportsToSetCurrency({
    expenseReports: moneyRequest.expenseReports,
    currency: moneyRequest.currency,
  }).add(
    reduceExpenseReturnsToSetCurrency({
      expenseReturns: moneyRequest.expenseReturns,
      currency: moneyRequest.currency,
    }),
  );

  if (currency !== moneyRequest.currency) {
    if (currency === "USD") {
      return totalAmountRequested
        .sub(totalAmountReportedOrReturned)
        .dividedBy(exchangeRate ?? 0)
        .toDecimalPlaces(2);
    }
    if (currency === "PYG") {
      return totalAmountRequested
        .sub(totalAmountReportedOrReturned)
        .times(exchangeRate ?? 0)
        .floor();
    }
  }
  return moneyRequest.currency === "USD"
    ? totalAmountRequested.sub(totalAmountReportedOrReturned).toDecimalPlaces(2)
    : totalAmountRequested.sub(totalAmountReportedOrReturned).floor();
}

export const handleTransactionConcept = (x: TransactionComplete) => {
  if (x.moneyAccountOffset?.offsetJustification) {
    return x.moneyAccountOffset.offsetJustification;
  }

  if (x.moneyRequest?.description) {
    return x.moneyRequest.description;
  }

  if (x.imbursement?.concept) {
    return x.imbursement.concept;
  }
  // if(x.im)

  return "-";
};
