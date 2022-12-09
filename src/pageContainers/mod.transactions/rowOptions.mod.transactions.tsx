import {
  Td,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { handleUseMutationAlerts } from '../../components/Toasts/MyToast';
import { trpcClient } from '../../lib/utils/trpcClient';
import type { TransactionComplete } from './TransactionsPage.mod.transactions';

const RowOptionsModTransactions = (x: TransactionComplete) => {
  const context = trpcClient.useContext();

  const { mutate: deleteById } = trpcClient.transaction.deleteById.useMutation(
    handleUseMutationAlerts({
      successText: 'Se ha eliminado la transaccion!',
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
          <MenuItem onClick={() => deleteById({ id: x.id })}>
            Ir a destino de concepto
          </MenuItem>
          <MenuItem onClick={() => deleteById({ id: x.id })}>Eliminar</MenuItem>
        </MenuList>
      </Menu>
    </Td>
  );
};

export default RowOptionsModTransactions;
