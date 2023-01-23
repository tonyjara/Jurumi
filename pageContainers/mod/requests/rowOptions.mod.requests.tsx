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
import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { handleUseMutationAlerts } from '@/components/Toasts & Alerts/MyToast';
import { trpcClient } from '@/lib/utils/trpcClient';
import type { MoneyRequestComplete } from './MoneyRequestsPage.mod.requests';
import { RowOptionDeleteDialog } from '@/components/Toasts & Alerts/RowOption.delete.dialog';
import { RowOptionCancelDialog } from '@/components/Toasts & Alerts/RowOptions.cancel.dialog';

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
          <MenuItem>Imprimir</MenuItem>
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
  );
};

export default RowOptionsModRequests;
