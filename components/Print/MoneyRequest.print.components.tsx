import type { CompleteMoneyReqHome } from '@/pageContainers/home/requests/HomeRequestsPage.home.requests';
import ExpenseRepAndRetPringPage from '@/pageContainers/home/settings/print-templates/ExpenseRepAndRetPrintPage.home.print.tsx';
import FundRequestPrintPage from '@/pageContainers/home/settings/print-templates/FundRequestPrintPage.home.print';
import MoneyOrderPrintPage from '@/pageContainers/home/settings/print-templates/MoneyOrderPrintPage.home.setting.print-templates';
import ReimbursementOrderPrintPage from '@/pageContainers/home/settings/print-templates/ReimbursementOrderPrintPage.home.settings.print-templates';
import type { MoneyRequestComplete } from '@/pageContainers/mod/requests/MoneyRequestsPage.mod.requests';
import React from 'react';

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
    <div>
      <div
        style={{ display: isPrinting ? 'flex' : 'none', width: '100%' }}
        ref={printFundReqRef}
      >
        {' '}
        {x.moneyRequestType === 'FUND_REQUEST' && (
          <FundRequestPrintPage moneyRequest={x} />
        )}
        {x.moneyRequestType === 'REIMBURSMENT_ORDER' && (
          <ReimbursementOrderPrintPage moneyRequest={x} />
        )}
        {x.moneyRequestType === 'MONEY_ORDER' && (
          <MoneyOrderPrintPage moneyRequest={x} />
        )}
      </div>
      <div
        style={{ display: isPrinting ? 'block' : 'none' }}
        ref={printExpRepsAndRetsRef}
      >
        <ExpenseRepAndRetPringPage moneyRequest={x} />
      </div>
    </div>
  );
};

export default MoneyRequestPrintComponents;
