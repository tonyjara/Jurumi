import { Tr, useDisclosure } from '@chakra-ui/react';
import type {
  Account,
  MoneyRequest,
  Project,
  Transaction,
} from '@prisma/client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import DateCell from '../../components/DynamicTables/DynamicCells/DateCell';
import EnumTextCell from '../../components/DynamicTables/DynamicCells/EnumTextCell';
import MoneyCell from '../../components/DynamicTables/DynamicCells/MoneyCell';
import PercentageCell from '../../components/DynamicTables/DynamicCells/PercentageCell';
import TextCell from '../../components/DynamicTables/DynamicCells/TextCell';
import type { TableOptions } from '../../components/DynamicTables/DynamicTable';
import DynamicTable from '../../components/DynamicTables/DynamicTable';
import TableSearchbar from '../../components/DynamicTables/Utils/TableSearchbar';
import EditMoneyRequestModal from '../../components/Modals/MoneyReq.edit.modal';
import CreateMoneyRequestModal from '../../components/Modals/MoneyRequest.create.modal';
import { ApprovalUtils } from '../../lib/utils/ApprovalUtilts';
import { reduceTransactionAmounts } from '../../lib/utils/TransactionUtils';
import {
  translatedMoneyReqStatus,
  translatedMoneyReqType,
} from '../../lib/utils/TranslatedEnums';
import { trpcClient } from '../../lib/utils/trpcClient';
import type { MoneyRequestsPageProps } from '../../pages/mod/requests';
import RowOptionsModRequests from './rowOptions.mod.requests';

export type MoneyRequestComplete = MoneyRequest & {
  account: Account;
  project: Project | null;
  transactions: Transaction[];
};

const MoneyRequestsPage = ({ query }: { query: MoneyRequestsPageProps }) => {
  const session = useSession();
  const user = session.data?.user;
  const [searchValue, setSearchValue] = useState('');
  const [editMoneyRequest, setEditMoneyRequest] = useState<MoneyRequest | null>(
    null
  );

  useEffect(() => {
    if (query.moneyRequestId) {
      setSearchValue(query.moneyRequestId);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const { data: moneyRequests } =
    trpcClient.moneyRequest.getManyComplete.useQuery({});
  const { data: findByIdData, isFetching } =
    trpcClient.moneyRequest.findCompleteById.useQuery(
      { id: searchValue },
      { enabled: searchValue.length > 0 }
    );

  const handleDataSource = () => {
    if (!moneyRequests) return [];
    if (findByIdData) return [findByIdData];
    if (moneyRequests) return moneyRequests;
    return [];
  };

  const tableOptions: TableOptions[] = [
    {
      onClick: onOpen,
      label: 'Crear solicitud',
    },
  ];

  const rowHandler = handleDataSource().map((x) => {
    const { needsApproval, approvalText, approverNames, hasBeenApproved } =
      ApprovalUtils(x as any, user);
    return (
      <Tr key={x.id}>
        <DateCell date={x.createdAt} />

        <TextCell
          text={needsApproval() ? approvalText : 'No req.'}
          hover={approverNames}
        />
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
        <RowOptionsModRequests
          needsApproval={needsApproval()}
          x={x}
          onEditOpen={onEditOpen}
          setEditMoneyRequest={setEditMoneyRequest}
          hasBeenApproved={hasBeenApproved()}
        />
      </Tr>
    );
  });

  return (
    <>
      <DynamicTable
        title={'Solicitudes'}
        searchBar={
          <TableSearchbar
            type="text"
            placeholder="Buscar por ID"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        }
        loading={isFetching}
        options={tableOptions}
        headers={[
          'F. Creacion',
          'Aprobación',
          'Desembolso',
          'Tipo',
          'Monto',
          'Creador',
          'Proyecto',
          'Ejecudado',
          'Opciones',
        ]}
        rows={rowHandler}
      />
      <CreateMoneyRequestModal orgId={null} isOpen={isOpen} onClose={onClose} />
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
