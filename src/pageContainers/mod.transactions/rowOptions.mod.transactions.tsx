import {
  Td,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import type { Transaction } from '@prisma/client';
import { useRouter } from 'next/router';
import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { handleUseMutationAlerts } from '../../components/Toasts/MyToast';
import { trpcClient } from '../../lib/utils/trpcClient';
import type { TransactionComplete } from './TransactionsPage.mod.transactions';

const RowOptionsModTransactions = ({
  x,
  onEditOpen,
  setEditTransaction,
}: {
  x: TransactionComplete;
  onEditOpen: () => void;
  setEditTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>;
}) => {
  const context = trpcClient.useContext();
  const router = useRouter();

  const { mutate: deleteById } = trpcClient.transaction.deleteById.useMutation(
    handleUseMutationAlerts({
      successText: 'Se ha eliminado la transaccion!',
      callback: () => {
        context.transaction.getManyComplete.invalidate();
        context.transaction.findManyCompleteById.invalidate();
      },
    })
  );

  const handleQueryParams = () => {
    if (x.moneyRequestId) return { moneyRequestId: x.moneyRequestId };
    if (x.imbursementId) return { imbursementId: x.imbursementId };
    if (x.expenseReturnId) return { expenseReturnId: x.expenseReturnId };

    return null;
  };

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
            onClick={() => {
              router.push({
                pathname: '/mod/requests',
                query: handleQueryParams(),
              });
            }}
          >
            Ir a destino de concepto
          </MenuItem>
          <MenuItem
            onClick={() => {
              setEditTransaction(x);
              onEditOpen();
            }}
          >
            Editar
          </MenuItem>
          <MenuItem onClick={() => deleteById({ id: x.id })}>Eliminar</MenuItem>
        </MenuList>
      </Menu>
    </Td>
  );
};

export default RowOptionsModTransactions;
