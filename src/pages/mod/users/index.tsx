import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Td,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import type { Account } from '@prisma/client';
import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import BooleanCell from '../../../components/DynamicTables/DynamicCells/BooleanCell';
import DateCell from '../../../components/DynamicTables/DynamicCells/DateCell';
import TextCell from '../../../components/DynamicTables/DynamicCells/TextCell';
import type { TableOptions } from '../../../components/DynamicTables/DynamicTable';
import DynamicTable from '../../../components/DynamicTables/DynamicTable';
import CreateAccountModal from '../../../components/Modals/account.create.modal';
import { handleUseMutationAlerts } from '../../../components/Toasts/MyToast';
import { trpcClient } from '../../../lib/utils/trpcClient';

const UsersPage = () => {
  const context = trpcClient.useContext();

  const { data } = trpcClient.account.getMany.useQuery();
  const { mutate } = trpcClient.account.toggleActivation.useMutation(
    handleUseMutationAlerts({
      successText: 'Se ha modificado la cuenta!',
      callback: () => {
        context.account.getMany.invalidate();
      },
    })
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const options: TableOptions[] = [
    {
      onClick: onOpen,
      label: 'Crear usuarios',
    },
  ];

  const rowOptionsButton = (x: Account) => (
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
              mutate({ id: x.id, active: !x.active });
            }}
          >
            {x.active ? 'Desactivar cuenta' : 'Activar cuenta'}
          </MenuItem>
        </MenuList>
      </Menu>
    </Td>
  );

  const rowHandler = data?.map((x) => {
    return (
      <Tr key={x.id}>
        <BooleanCell isActive={x.active} />
        <TextCell text={x.displayName} />
        <TextCell text={x.email} />
        <TextCell text={x.role} />
        <BooleanCell isActive={x.isVerified} />
        <DateCell date={x.createdAt} />
        {rowOptionsButton(x)}
      </Tr>
    );
  });

  return (
    <>
      <DynamicTable
        title={'Usuarios'}
        options={options}
        headers={[
          'Activado',
          'Nombre',
          'Correo',
          'Rol',
          'Verificado',
          'F. Creacion',
          'Opciones',
        ]}
        rows={rowHandler}
      />
      <CreateAccountModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default UsersPage;
