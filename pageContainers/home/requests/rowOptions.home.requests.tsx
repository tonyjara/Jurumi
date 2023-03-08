import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Portal,
} from '@chakra-ui/react';
import type { MoneyRequest } from '@prisma/client';

import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { handleUseMutationAlerts } from '@/components/Toasts & Alerts/MyToast';
import { trpcClient } from '@/lib/utils/trpcClient';
import type { CompleteMoneyReqHome } from './HomeRequestsPage.home.requests';
import { RowOptionDeleteDialog } from '@/components/Toasts & Alerts/RowOption.delete.dialog';
import {
  reduceExpenseReports,
  reduceExpenseReturns,
} from '@/lib/utils/TransactionUtils';
import MoneyRequestPrintComponents from '@/components/Print/MoneyRequest.print.components';
import UsePrintComponent from '@/components/Print/UsePrintComponent';
import { RowOptionCancelDialog } from '@/components/Toasts & Alerts/RowOptions.cancel.dialog';

const RowOptionsHomeRequests = ({
  x,
  setEditMoneyRequest,
  onEditOpen,
  onExpRepOpen,
  setReqForReport,
  onExpReturnOpen,
}: {
  x: CompleteMoneyReqHome;
  setEditMoneyRequest: React.Dispatch<
    React.SetStateAction<MoneyRequest | null>
  >;
  setReqForReport: React.Dispatch<
    React.SetStateAction<CompleteMoneyReqHome | null>
  >;
  onEditOpen: () => void;
  onExpRepOpen: () => void;
  onExpReturnOpen: () => void;
}) => {
  const context = trpcClient.useContext();

  const { mutate: deleteById } = trpcClient.moneyRequest.deleteById.useMutation(
    handleUseMutationAlerts({
      successText: 'Se ha eliminado la solicitud!',
      callback: () => {
        context.moneyRequest.invalidate();
      },
    })
  );

  const { mutate: cancelById } =
    trpcClient.moneyRequest.cancelMyOwnById.useMutation(
      handleUseMutationAlerts({
        successText: 'Se ha anulado su solicitud!',
        callback: () => {
          context.invalidate();
        },
      })
    );

  const isAccepted = x.status === 'ACCEPTED';

  const isFullyExecuted = reduceExpenseReports(x.expenseReports)
    .add(reduceExpenseReturns(x.expenseReturns))
    .equals(x.amountRequested);

  const {
    isPrinting,
    handlePrintExpenseRepsAndRets,
    handlePrintFundRequest,
    printFundReqRef,
    printExpRepsAndRetsRef,
  } = UsePrintComponent({ x });

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
              isDisabled={
                !isAccepted ||
                x.wasCancelled ||
                isFullyExecuted ||
                x.moneyRequestType === 'REIMBURSMENT_ORDER'
              }
              onClick={() => {
                setReqForReport(x);
                onExpRepOpen();
              }}
            >
              Crear rendición
            </MenuItem>
            <MenuItem
              isDisabled={
                !isAccepted ||
                x.wasCancelled ||
                isFullyExecuted ||
                x.moneyRequestType === 'REIMBURSMENT_ORDER'
              }
              onClick={() => {
                setReqForReport(x);
                onExpReturnOpen();
              }}
            >
              Generar devolución
            </MenuItem>
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

            <MenuItem
              isDisabled={isAccepted || x.wasCancelled}
              onClick={() => {
                setEditMoneyRequest(x);
                onEditOpen();
              }}
            >
              Editar
            </MenuItem>

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
      <MoneyRequestPrintComponents
        x={x}
        isPrinting={isPrinting}
        printExpRepsAndRetsRef={printExpRepsAndRetsRef}
        printFundReqRef={printFundReqRef}
      />
    </div>
  );
};

export default RowOptionsHomeRequests;
