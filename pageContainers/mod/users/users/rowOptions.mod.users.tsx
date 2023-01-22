import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Portal,
} from '@chakra-ui/react';
import type { Account } from '@prisma/client';
import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { handleUseMutationAlerts } from '@/components/Toasts/MyToast';
import { trpcClient } from '@/lib/utils/trpcClient';
import type { FormAccount } from '@/lib/validations/account.validate';

const RowOptionsModUsers = ({
  x,
  setEditAccount,
  onEditOpen,
}: {
  onEditOpen: () => void;
  setEditAccount: React.Dispatch<React.SetStateAction<FormAccount | null>>;
  x: Account;
}) => {
  const context = trpcClient.useContext();

  const { mutate } = trpcClient.account.toggleActivation.useMutation(
    handleUseMutationAlerts({
      successText: 'Se ha modificado la cuenta!',
      callback: () => {
        context.account.getMany.invalidate();
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
            onClick={() => {
              mutate({ id: x.id, active: !x.active });
            }}
          >
            {x.active ? 'Desactivar cuenta' : 'Activar cuenta'}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setEditAccount(x);
              onEditOpen();
            }}
          >
            Editar
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default RowOptionsModUsers;
