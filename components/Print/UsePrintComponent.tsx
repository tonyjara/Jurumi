import { translatedMoneyReqType } from '@/lib/utils/TranslatedEnums';
import type { CompleteMoneyReqHome } from '@/pageContainers/home/requests/HomeRequestsPage.home.requests';
import type { MoneyRequestComplete } from '@/pageContainers/mod/requests/MoneyRequestsPage.mod.requests';
import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

const UsePrintComponent = ({
  x,
}: {
  x: MoneyRequestComplete | CompleteMoneyReqHome;
}) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const printFundReqRef = useRef(null);
  const printExpRepsAndRetsRef = useRef(null);
  const promiseResolveRef = useRef<any>(null);
  // We watch for the state to change here, and for the Promise resolve to be available
  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
      promiseResolveRef.current();
    }
  }, [isPrinting]);

  const handlePrintFundRequest = useReactToPrint({
    documentTitle: `${translatedMoneyReqType(x.moneyRequestType)} - ${
      x.account.displayName
    } - ${format(new Date(), 'dd/MM/yy')}`,
    content: () => printFundReqRef.current,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      // Reset the Promise resolve so we can print again
      promiseResolveRef.current = null;
      setIsPrinting(false);
    },
  });
  const handlePrintExpenseRepsAndRets = useReactToPrint({
    documentTitle: `Rendiciones - ${x.account.displayName} - ${format(
      new Date(),
      'dd/MM/yy'
    )}`,
    content: () => printExpRepsAndRetsRef.current,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      // Reset the Promise resolve so we can print again
      promiseResolveRef.current = null;
      setIsPrinting(false);
    },
  });
  return {
    handlePrintExpenseRepsAndRets,
    handlePrintFundRequest,
    isPrinting,
    printFundReqRef,
    printExpRepsAndRetsRef,
  };
};

export default UsePrintComponent;