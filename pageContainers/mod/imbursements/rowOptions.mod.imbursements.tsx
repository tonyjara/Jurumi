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
import type { imbursementComplete } from './ImbursementsPage.mod.imbursements';
import type { FormImbursement } from '@/lib/validations/imbursement.validate';
import { RowOptionDeleteDialog } from '@/components/Toasts & Alerts/RowOption.delete.dialog';
import { RowOptionCancelDialog } from '@/components/Toasts & Alerts/RowOptions.cancel.dialog';

const RowOptionsImbursements = ({
  x,
  setEditImbursement,
  onEditOpen,
}: {
  x: imbursementComplete;
  setEditImbursement: React.Dispatch<
    React.SetStateAction<FormImbursement | null>
  >;
  onEditOpen: () => void;
}) => {
  const context = trpcClient.useContext();

  const { mutate: deleteById } = trpcClient.imbursement.deleteById.useMutation(
    handleUseMutationAlerts({
      successText: 'Se ha eliminado el desembolso!',
      callback: () => {
        context.imbursement.invalidate();
        context.moneyAcc.invalidate();
      },
    })
  );

  const { mutate: cancelById } = trpcClient.imbursement.cancelById.useMutation(
    handleUseMutationAlerts({
      successText: 'Se ha anulado la transaccion!',
      callback: () => {
        context.imbursement.invalidate();
        context.moneyAcc.invalidate();
        context.transaction.invalidate();
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
          {!!x.wasCancelled && (
            <MenuItem>Este desembolso fue anulado.</MenuItem>
          )}
          <MenuItem
            onClick={() => {
              setEditImbursement(x);
              onEditOpen();
            }}
            isDisabled={x.wasCancelled}
          >
            Editar
          </MenuItem>
          <RowOptionCancelDialog
            isDisabled={x.wasCancelled}
            targetName="desembolso"
            onConfirm={() => cancelById({ id: x.id })}
          />
          <RowOptionDeleteDialog
            targetName="desembolso"
            onConfirm={() => deleteById({ id: x.id })}
          />
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default RowOptionsImbursements;
