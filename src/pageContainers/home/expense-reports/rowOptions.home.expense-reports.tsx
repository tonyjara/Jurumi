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
import { handleUseMutationAlerts } from '../../../components/Toasts/MyToast';
import { trpcClient } from '../../../lib/utils/trpcClient';
import type { MyExpenseReport } from './ExpenseReportsPage.home.expense-reports';

const RowOptionsHomeRequests = ({
  x,
  setEditExpenseReport,
  onEditOpen,
}: {
  x: MyExpenseReport;
  setEditExpenseReport: React.Dispatch<
    React.SetStateAction<MyExpenseReport | null>
  >;
  onEditOpen: () => void;
}) => {
  const context = trpcClient.useContext();

  const { mutate: deleteById } =
    trpcClient.expenseReport.deleteById.useMutation(
      handleUseMutationAlerts({
        successText: 'Se ha eliminado su rendición',
        callback: () => {
          context.expenseReport.invalidate();
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
              setEditExpenseReport(x);
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
