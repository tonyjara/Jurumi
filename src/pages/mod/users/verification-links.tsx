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
import type { AccountVerificationLinks } from '@prisma/client';
import { addHours, isBefore } from 'date-fns';
import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import BooleanCell from '../../../components/DynamicTables/DynamicCells/BooleanCell';
import DateCell from '../../../components/DynamicTables/DynamicCells/DateCell';
import TextCell from '../../../components/DynamicTables/DynamicCells/TextCell';
import type { TableOptions } from '../../../components/DynamicTables/DynamicTable';
import DynamicTable from '../../../components/DynamicTables/DynamicTable';
import CopyLinkCellButton from '../../../components/DynamicTables/usersPage/CopyLink.cellButton';
import CreateAccountModal from '../../../components/Modals/account.create.modal';
import {
  handleUseMutationAlerts,
  myToast,
} from '../../../components/Toasts/MyToast';
import { trpcClient } from '../../../lib/utils/trpcClient';

const VerificationLinks = () => {
  const context = trpcClient.useContext();

  const { data } = trpcClient.verificationLinks.getVerificationLinks.useQuery();
  const { mutate } =
    trpcClient.verificationLinks.generateVerificationLink.useMutation(
      handleUseMutationAlerts({
        successText: 'Se ha generado otro link!',
        callback: () => {
          context.verificationLinks.getVerificationLinks.invalidate();
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

  const rowOptionsButton = (
    x: AccountVerificationLinks & {
      account: {
        displayName: string;
      };
    }
  ) => (
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
              if (x.hasBeenUsed) {
                return myToast.error(
                  'La cuenta ya fue activada, no puede generarse otro link.'
                );
              }
              mutate({ email: x.email, displayName: x.account.displayName });
            }}
          >
            Generar nuevo link para este correo.
          </MenuItem>
        </MenuList>
      </Menu>
    </Td>
  );

  const rowHandler = data?.map((x) => {
    const isActive =
      isBefore(new Date(), addHours(x.createdAt, 1)) && !x.hasBeenUsed;
    return (
      <Tr key={x.id}>
        <DateCell date={x.createdAt} />
        <TextCell text={x.email} />
        <BooleanCell isActive={isActive} />
        <BooleanCell isActive={x.hasBeenUsed} />
        {isActive ? <CopyLinkCellButton {...x} /> : <Td></Td>}
        {rowOptionsButton(x)}
      </Tr>
    );
  });

  return (
    <>
      <DynamicTable
        title={'Links de verificación'}
        subTitle="Los links tienen una máxima duración de 1 hora."
        options={options}
        headers={[
          'F. Creacion',
          'Correo',
          'Disponible',
          'Activado',
          'Link',
          'Opciones',
        ]}
        rows={rowHandler}
      />
      <CreateAccountModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default VerificationLinks;
