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
import FundRequestPrintPage from '@/pageContainers/home/print/FundRequestPrintPage.home.print';
import { useReactToPrint } from 'react-to-print';
import { translatedMoneyReqType } from '@/lib/utils/TranslatedEnums';
import { format } from 'date-fns';

const RowOptionsModRequests = ({
  x,
  setEditMoneyRequest,
  onEditOpen,
  needsApproval,
  hasBeenApproved,
}: {
  x: MoneyRequestComplete;
  setEditMoneyRequest: React.Dispatch<
    React.SetStateAction<MoneyRequest | null>
  >;
  onEditOpen: () => void;
  needsApproval: boolean;
  hasBeenApproved: boolean;
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

  const printRef = useRef(null);
  const promiseResolveRef = useRef<any>(null);
  // We watch for the state to change here, and for the Promise resolve to be available
  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
      promiseResolveRef.current();
    }
  }, [isPrinting]);

  const handlePrint = useReactToPrint({
    documentTitle: `${translatedMoneyReqType(x.moneyRequestType)} - ${
      x.account.displayName
    } - ${format(x.createdAt, 'dd/MM/yy')}`,
    content: () => printRef.current,
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
            <MenuItem onClick={handlePrint}>Imprimir</MenuItem>
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
      <div style={{ display: isPrinting ? 'block' : 'none' }} ref={printRef}>
        <FundRequestPrintPage moneyRequest={x} />
      </div>
    </div>
  );
};

export default RowOptionsModRequests;
