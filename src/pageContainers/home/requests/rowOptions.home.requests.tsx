import {
  Td,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import type {
  CostCategory,
  ExpenseReport,
  MoneyRequest,
  Project,
  Transaction,
} from '@prisma/client';

import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { handleUseMutationAlerts } from '../../../components/Toasts/MyToast';
import { trpcClient } from '../../../lib/utils/trpcClient';

type MyMoneyRequests = MoneyRequest & {
  transactions: Transaction[];
  project: Project | null;
  costCategory: CostCategory | null;
  expenseReports: ExpenseReport[];
};

const RowOptionsHomeRequests = ({
  x,
  setEditMoneyRequest,
  onEditOpen,
  onExpRepOpen,
  setReqForReport,
}: {
  x: MyMoneyRequests;
  setEditMoneyRequest: React.Dispatch<
    React.SetStateAction<MoneyRequest | null>
  >;
  setReqForReport: React.Dispatch<React.SetStateAction<MoneyRequest | null>>;
  onEditOpen: () => void;
  onExpRepOpen: () => void;
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
            onClick={() => {
              setReqForReport(x);
              onExpRepOpen();
            }}
          >
            Crear rendición
          </MenuItem>

          <MenuItem
            onClick={() => {
              setEditMoneyRequest(x);
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

export default RowOptionsHomeRequests;
