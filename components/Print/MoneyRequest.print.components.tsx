import { CompleteMoneyReqHome } from "@/pageContainers/home/requests/home.requests.types";
import ExpenseRepAndRetPringPage from "@/pageContainers/home/settings/print-templates/ExpenseRepAndRetPrintPage.home.print.tsx";
import FundRequestPrintPage from "@/pageContainers/home/settings/print-templates/FundRequestPrintPage.home.print";
import MoneyOrderPrintPage from "@/pageContainers/home/settings/print-templates/MoneyOrderPrintPage.home.setting.print-templates";
import ReimbursementOrderPrintPage from "@/pageContainers/home/settings/print-templates/ReimbursementOrderPrintPage.home.settings.print-templates";
import { MoneyRequestComplete } from "@/pageContainers/mod/requests/mod.requests.types";
import React from "react";

const MoneyRequestPrintComponents = ({
  isPrinting,
  printExpRepsAndRetsRef,
  printFundReqRef,
  x,
}: {
  isPrinting: boolean;
  x: MoneyRequestComplete | CompleteMoneyReqHome;
  printFundReqRef: React.MutableRefObject<null>;
  printExpRepsAndRetsRef: React.MutableRefObject<null>;
}) => {
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{ display: isPrinting ? "block" : "none", width: "100%" }}
        ref={printFundReqRef}
      >
        {" "}
        {x.moneyRequestType === "FUND_REQUEST" && (
          <FundRequestPrintPage moneyRequest={x} />
        )}
        {x.moneyRequestType === "REIMBURSMENT_ORDER" && (
          <ReimbursementOrderPrintPage moneyRequest={x} />
        )}
        {x.moneyRequestType === "MONEY_ORDER" && (
          <MoneyOrderPrintPage moneyRequest={x} />
        )}
      </div>
      <div
        style={{ display: isPrinting ? "block" : "none" }}
        ref={printExpRepsAndRetsRef}
      >
        {(x.moneyRequestType === "FUND_REQUEST" ||
          x.moneyRequestType === "MONEY_ORDER") && (
          <ExpenseRepAndRetPringPage moneyRequest={x} />
        )}
      </div>
    </div>
  );
};

export default MoneyRequestPrintComponents;
