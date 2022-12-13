import {
  Td,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import type { MoneyRequest } from '@prisma/client';
import { cloneDeep } from 'lodash';
import router from 'next/router';
import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { handleUseMutationAlerts } from '../../components/Toasts/MyToast';
import { trpcClient } from '../../lib/utils/trpcClient';
import type { MoneyRequestComplete } from './MoneyRequestsPage.mod.requests';

const RowOptionsModRequests = ({
  x,
  setEditMoneyRequest,
  onEditOpen,
  needsApproval,
}: {
  x: MoneyRequestComplete;
  setEditMoneyRequest: React.Dispatch<
    React.SetStateAction<MoneyRequest | null>
  >;
  onEditOpen: () => void;
  needsApproval: boolean;
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

  return (
    <Td>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="options button"
          icon={<BsThreeDots />}
        />
        <MenuList>
          <MenuItem
            isDisabled={needsApproval}
            onClick={() => {
              router.push({
                pathname: '/home/create/transaction',
                query: { moneyRequestId: x.id },
              });
            }}
          >
            Aceptar y ejecutar {needsApproval && '( Necesita aprovación )'}
          </MenuItem>
          <MenuItem
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
          <MenuItem onClick={() => deleteById({ id: x.id })}>Eliminar</MenuItem>
        </MenuList>
      </Menu>
    </Td>
  );
};

export default RowOptionsModRequests;
