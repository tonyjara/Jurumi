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
        context.moneyRequest.getManyComplete.invalidate();
      },
    })
  );
  const isAccepted = x.status === 'ACCEPTED';

  const isFullyExecuted = reduceExpenseReports(x.expenseReports)
    .add(reduceExpenseReturns(x.expenseReturns))
    .equals(x.amountRequested);

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="options button"
        icon={<BsThreeDots />}
      />
      <Portal>
        <MenuList>
          <MenuItem
            isDisabled={!isAccepted || x.wasCancelled || isFullyExecuted}
            onClick={() => {
              setReqForReport(x);
              onExpRepOpen();
            }}
          >
            Crear rendición
          </MenuItem>
          <MenuItem
            isDisabled={!isAccepted || x.wasCancelled || isFullyExecuted}
            onClick={() => {
              setReqForReport(x);
              onExpReturnOpen();
            }}
          >
            Generar devolución
          </MenuItem>

          <MenuItem
            isDisabled={isAccepted || x.wasCancelled}
            onClick={() => {
              setEditMoneyRequest(x);
              onEditOpen();
            }}
          >
            Editar
          </MenuItem>

          <RowOptionDeleteDialog
            targetName="solicitud"
            onConfirm={() => deleteById({ id: x.id })}
          />
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default RowOptionsHomeRequests;
