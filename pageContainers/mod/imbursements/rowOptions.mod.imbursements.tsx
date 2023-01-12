import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { handleUseMutationAlerts } from '@/components/Toasts/MyToast';
import { trpcClient } from '@/lib/utils/trpcClient';
import type { imbursementComplete } from './ImbursementsPage.mod.imbursements';
import type { FormImbursement } from '@/lib/validations/imbursement.validate';

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
      <MenuList>
        {!!x.wasCancelled && <MenuItem>Este desembolso fue anulado.</MenuItem>}
        <MenuItem
          onClick={() => {
            setEditImbursement(x);
            onEditOpen();
          }}
          isDisabled={x.wasCancelled}
        >
          Editar
        </MenuItem>
        <MenuItem
          isDisabled={x.wasCancelled}
          onClick={() => cancelById({ id: x.id })}
        >
          Anular
        </MenuItem>

        <MenuItem onClick={() => deleteById({ id: x.id })}>Eliminar</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default RowOptionsImbursements;
