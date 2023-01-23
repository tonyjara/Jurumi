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
import type { ProjectForTable } from './ProjectsTable.mod.projects';

const RowOptionsModProjects = ({
  x,
  setEditProject,
  onEditOpen,
}: {
  x: ProjectForTable;
  setEditProject: React.Dispatch<React.SetStateAction<ProjectForTable | null>>;
  onEditOpen: () => void;
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
              setEditProject(x);
              onEditOpen();
            }}
          >
            Editar
          </MenuItem>

          <MenuItem onClick={() => deleteById({ id: x.id })}>Eliminar</MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default RowOptionsModProjects;
