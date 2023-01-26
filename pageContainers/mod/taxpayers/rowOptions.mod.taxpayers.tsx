import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { handleUseMutationAlerts } from '@/components/Toasts & Alerts/MyToast';
import { trpcClient } from '@/lib/utils/trpcClient';
import type { FormTaxPayer } from '@/lib/validations/taxtPayer.validate';

const RowOptionsHomeTaxPayers = ({
  x,
  setEditTaxPayer,
  onEditOpen,
}: {
  x: FormTaxPayer;
  setEditTaxPayer: React.Dispatch<React.SetStateAction<FormTaxPayer | null>>;
  onEditOpen: () => void;
}) => {
  const context = trpcClient.useContext();

  const { mutate: deleteById } = trpcClient.taxPayer.deleteById.useMutation(
    handleUseMutationAlerts({
      successText: 'Se ha eliminado el contribuyente!',
      callback: () => {
        context.taxPayer.invalidate();
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
        <MenuItem
          onClick={() => {
            setEditTaxPayer(x);
            onEditOpen();
          }}
        >
          Editar
        </MenuItem>

        <MenuItem onClick={() => deleteById({ id: x.id })}>Eliminar</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default RowOptionsHomeTaxPayers;
