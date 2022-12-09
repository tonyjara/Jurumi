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
import type {
  Account,
  MoneyRequest,
  Project,
  Transaction,
} from '@prisma/client';
import { cloneDeep } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import DateCell from '../components/DynamicTables/DynamicCells/DateCell';
import EnumTextCell from '../components/DynamicTables/DynamicCells/EnumTextCell';
import MoneyCell from '../components/DynamicTables/DynamicCells/MoneyCell';
import PercentageCell from '../components/DynamicTables/DynamicCells/PercentageCell';
import TextCell from '../components/DynamicTables/DynamicCells/TextCell';
import type { TableOptions } from '../components/DynamicTables/DynamicTable';
import DynamicTable from '../components/DynamicTables/DynamicTable';
import EditMoneyRequestModal from '../components/Modals/MoneyReq.edit.modal';
import CreateMoneyRequestModal from '../components/Modals/MoneyRequest.create.modal';
import { handleUseMutationAlerts } from '../components/Toasts/MyToast';
import { reduceTransactionAmounts } from '../lib/utils/TransactionUtils';
import {
  translatedMoneyReqStatus,
  translatedMoneyReqType,
} from '../lib/utils/TranslatedEnums';
import { trpcClient } from '../lib/utils/trpcClient';

type MoneyRequestComplete = MoneyRequest & {
  account: Account;
  project: Project | null;
  transactions: Transaction[];
};

const MoneyRequestsPage = () => {
  const context = trpcClient.useContext();
  const router = useRouter();
  const [editMoneyRequest, setEditMoneyRequest] = useState<MoneyRequest | null>(
    null
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  useEffect(() => {
    if (!isEditOpen && editMoneyRequest) {
      setEditMoneyRequest(null);
    }

    return () => {};
  }, [editMoneyRequest, isEditOpen]);

  const { data } = trpcClient.moneyRequest.getManyComplete.useQuery();
  const { mutate: deleteById } = trpcClient.moneyRequest.deleteById.useMutation(
    handleUseMutationAlerts({
      successText: 'Se ha eliminado la solicitud!',
      callback: () => {
        context.moneyRequest.getManyComplete.invalidate();
      },
    })
  );

  const tableOptions: TableOptions[] = [
    {
      onClick: onOpen,
      label: 'Crear solicitud',
    },
  ];

  const rowOptionsButton = (x: MoneyRequestComplete) => (
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
              router.push({
                pathname: '/home/create/transaction',
                query: { moneyRequestId: x.id },
              });
            }}
          >
            Aceptar y ejecutar
          </MenuItem>
          <MenuItem
            onClick={() => {
              const rejected = cloneDeep(x);
              rejected.status = 'REJECTED';
              setEditMoneyRequest(rejected);
              onEditOpen();
            }}
          >
            Rechazar
          </MenuItem>
          <MenuItem
            onClick={() => {
              setEditMoneyRequest(x);
              onEditOpen();
            }}
          >
            Editar
          </MenuItem>
          <MenuItem>Ver transacciones</MenuItem>
          <MenuItem>Exportar como excel</MenuItem>
          <MenuItem>Imprimir</MenuItem>
          <MenuItem onClick={() => deleteById({ id: x.id })}>Eliminar</MenuItem>
        </MenuList>
      </Menu>
    </Td>
  );

  const rowHandler = data?.map((x) => {
    return (
      <Tr key={x.id}>
        <DateCell date={x.createdAt} />

        <EnumTextCell
          text={x.status}
          enumFunc={translatedMoneyReqStatus}
          hover={x.rejectionMessage}
        />
        <EnumTextCell
          text={x.moneyRequestType}
          enumFunc={translatedMoneyReqType}
        />
        <MoneyCell objectKey={'amountRequested'} data={x} />
        <TextCell text={x.account.displayName} />
        <TextCell text={x.project?.displayName ?? '-'} />
        <PercentageCell
          total={x.amountRequested}
          executed={reduceTransactionAmounts(x.transactions)}
          currency={x.currency}
        />
        {rowOptionsButton(x)}
      </Tr>
    );
  });

  return (
    <>
      <DynamicTable
        title={'Solicitudes'}
        options={tableOptions}
        headers={[
          'F. Creacion',
          'Status',
          'Tipo',
          'Monto',
          'Creador',
          'Proyecto',
          'Ejecudado',
          'Opciones',
        ]}
        rows={rowHandler}
      />
      <CreateMoneyRequestModal isOpen={isOpen} onClose={onClose} />
      {editMoneyRequest && (
        <EditMoneyRequestModal
          moneyRequest={editMoneyRequest}
          isOpen={isEditOpen}
          onClose={onEditClose}
        />
      )}
    </>
  );
};

export default MoneyRequestsPage;
