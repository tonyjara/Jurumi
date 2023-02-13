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
import type { CompleteMember } from './MembersListPage.mod.members';

const RowOptiosnMembersListPage = ({
  x,
  setEditMember,
  onEditOpen,
}: {
  onEditOpen: () => void;
  setEditMember: React.Dispatch<React.SetStateAction<CompleteMember | null>>;
  x: CompleteMember;
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
              setEditMember(x);
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

export default RowOptiosnMembersListPage;
