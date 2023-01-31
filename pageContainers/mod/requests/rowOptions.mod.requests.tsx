import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Portal,
} from '@chakra-ui/react';
import type { MoneyRequest } from '@prisma/client';
import { cloneDeep } from 'lodash';
import router from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { handleUseMutationAlerts } from '@/components/Toasts & Alerts/MyToast';
import { trpcClient } from '@/lib/utils/trpcClient';
import type { MoneyRequestComplete } from './MoneyRequestsPage.mod.requests';
import { RowOptionDeleteDialog } from '@/components/Toasts & Alerts/RowOption.delete.dialog';
import { RowOptionCancelDialog } from '@/components/Toasts & Alerts/RowOptions.cancel.dialog';
import FundRequestPrintPage from '@/pageContainers/home/settings/print-templates/FundRequestPrintPage.home.print';
import { useReactToPrint } from 'react-to-print';
import { translatedMoneyReqType } from '@/lib/utils/TranslatedEnums';
import { format } from 'date-fns';
import ExpenseRepAndRetPringPage from '@/pageContainers/home/settings/print-templates/ExpenseRepAndRetPrintPage.home.print.tsx';
import {
  reduceExpenseReports,
  reduceExpenseReturns,
} from '@/lib/utils/TransactionUtils';
import ReimbursementOrderPrintPage from '@/pageContainers/home/settings/print-templates/ReimbursementOrderPrintPage.home.settings.print-templates';
import MoneyOrderPrintPage from '@/pageContainers/home/settings/print-templates/MoneyOrderPrintPage.home.setting.print-templates';

const RowOptionsModRequests = ({
  x,
  setEditMoneyRequest,
  onEditOpen,
  needsApproval,
  hasBeenApproved,
  setReqForReport,
  onExpRepOpen,
}: {
  x: MoneyRequestComplete;
  setEditMoneyRequest: React.Dispatch<
    React.SetStateAction<MoneyRequest | null>
  >;
  onEditOpen: () => void;
  needsApproval: boolean;
  hasBeenApproved: boolean;
  setReqForReport: React.Dispatch<
    React.SetStateAction<MoneyRequestComplete | null>
  >;
  onExpRepOpen: () => void;
}) => {
  const context = trpcClient.useContext();
  const [isPrinting, setIsPrinting] = useState(false);

  const { mutate: deleteById } = trpcClient.moneyRequest.deleteById.useMutation(
    handleUseMutationAlerts({
      successText: 'Se ha eliminado la solicitud!',
      callback: () => {
        context.invalidate();
      },
    })
  );
  const { mutate: cancelById } = trpcClient.moneyRequest.cancelById.useMutation(
    handleUseMutationAlerts({
      successText: 'Se ha anulado la solicitud!',
      callback: () => {
        context.invalidate();
      },
    })
  );
  const isAccepted = x.status === 'ACCEPTED';
  const isFullyExecuted = reduceExpenseReports(x.expenseReports)
    .add(reduceExpenseReturns(x.expenseReturns))
    .equals(x.amountRequested);

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
    documentTitle: `${translatedMoneyReqType(x.moneyRequestType)} - ${
      x.account.displayName
    } - ${format(new Date(), 'dd/MM/yy')}`,
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

  return (
    <div>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="options button"
          icon={<BsThreeDots />}
        />
        <Portal>
          <MenuList>
            <MenuItem
              isDisabled={(needsApproval && !hasBeenApproved) || isAccepted}
              onClick={() => {
                router.push({
                  pathname: '/mod/transactions/create',
                  query: { moneyRequestId: x.id },
                });
              }}
            >
              Aceptar y ejecutar{' '}
              {needsApproval && !hasBeenApproved && '( Necesita aprovación )'}
            </MenuItem>
            <MenuItem
              isDisabled={isAccepted}
              onClick={() => {
                const rejected = cloneDeep(x);
                rejected.status = 'REJECTED';
                setEditMoneyRequest(rejected);
                onEditOpen();
              }}
            >
              Rechazar
            </MenuItem>
            <MenuItem
              isDisabled={isAccepted}
              onClick={() => {
                setEditMoneyRequest(x);
                onEditOpen();
              }}
            >
              Editar
            </MenuItem>

            {x.moneyRequestType === 'FUND_REQUEST' && (
              <MenuItem
                isDisabled={!isAccepted || x.wasCancelled || isFullyExecuted}
                onClick={() => {
                  setReqForReport(x);
                  onExpRepOpen();
                }}
              >
                Crear rendición
              </MenuItem>
            )}

            <MenuItem
              onClick={() => {
                router.push({
                  pathname: '/mod/transactions',
                  query: { transactionIds: x.transactions.map((x) => x.id) },
                });
              }}
            >
              Ver transacciones
            </MenuItem>
            <MenuItem>Exportar como excel</MenuItem>
            <MenuItem onClick={handlePrintFundRequest}>
              Imprimir solicitud
            </MenuItem>

            {x.moneyRequestType === 'FUND_REQUEST' && (
              <MenuItem
                isDisabled={!isFullyExecuted}
                onClick={handlePrintExpenseRepsAndRets}
              >
                Imprimir rendición
              </MenuItem>
            )}
            <RowOptionCancelDialog
              isDisabled={x.wasCancelled}
              targetName="solicitud"
              onConfirm={() => cancelById({ id: x.id })}
            />
            <RowOptionDeleteDialog
              targetName="solicitud"
              onConfirm={() => deleteById({ id: x.id })}
            />
          </MenuList>
        </Portal>
      </Menu>
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

export default RowOptionsModRequests;
