import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Portal,
} from '@chakra-ui/react';
import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { handleUseMutationAlerts } from '@/components/Toasts & Alerts/MyToast';
import { trpcClient } from '@/lib/utils/trpcClient';
import { RowOptionDeleteDialog } from '@/components/Toasts & Alerts/RowOption.delete.dialog';
import { RowOptionCancelDialog } from '@/components/Toasts & Alerts/RowOptions.cancel.dialog';
import type { ExpenseReportComplete } from './ModExpenseReportsPage.mod.expense-reports';

const RowOptionsHomeExpenseReports = ({
  x,
  setEditExpenseReport,
  onEditOpen,
}: {
  x: ExpenseReportComplete;
  setEditExpenseReport: React.Dispatch<
    React.SetStateAction<ExpenseReportComplete | null>
  >;
  onEditOpen: () => void;
}) => {
  const context = trpcClient.useContext();

  const { mutate: cancelById } =
    trpcClient.expenseReport.cancelById.useMutation(
      handleUseMutationAlerts({
        successText: 'Se ha anulado su rendición',
        callback: () => {
          context.expenseReport.invalidate();
        },
      })
    );
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
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="options button"
        icon={<BsThreeDots />}
      />
      <Portal>
        <MenuList>
          <MenuItem
            isDisabled={x.wasCancelled}
            onClick={() => {
              setEditExpenseReport(x);
              onEditOpen();
            }}
          >
            Editar
          </MenuItem>

          <RowOptionCancelDialog
            isDisabled={x.wasCancelled}
            targetName="rendición"
            onConfirm={() => cancelById({ id: x.id })}
          />
          <RowOptionDeleteDialog
            targetName="rendición"
            onConfirm={() => deleteById({ id: x.id })}
          />
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default RowOptionsHomeExpenseReports;
