import { Tr, useDisclosure } from '@chakra-ui/react';
import type {
  Account,
  MoneyAccount,
  MoneyRequest,
  Transaction,
} from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import DateCell from '../../components/DynamicTables/DynamicCells/DateCell';
import MoneyCell from '../../components/DynamicTables/DynamicCells/MoneyCell';
import TextCell from '../../components/DynamicTables/DynamicCells/TextCell';
import DynamicTable from '../../components/DynamicTables/DynamicTable';
import TableSearchbar from '../../components/DynamicTables/Utils/TableSearchbar';
import EditMoneyRequestModal from '../../components/Modals/MoneyReq.edit.modal';
import CreateMoneyRequestModal from '../../components/Modals/MoneyRequest.create.modal';
import { translatedMoneyReqType } from '../../lib/utils/TranslatedEnums';
import { trpcClient } from '../../lib/utils/trpcClient';
import RowOptionsModTransactions from './rowOptions.mod.transactions';

export type TransactionComplete = Transaction & {
  moneyAccount: MoneyAccount;
  account: Account;
  moneyRequest: MoneyRequest | null;
};

const TransactionsPage = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
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

  const { data } = trpcClient.transaction.getManyComplete.useQuery();
  const { data: findByIdData, isLoading: findIsLoading } =
    trpcClient.transaction.findCompleteById.useQuery({ id: searchValue });

  const handleTransactionConcept = (x: TransactionComplete) => {
    if (x.moneyRequest) {
      return translatedMoneyReqType(x.moneyRequest.moneyRequestType);
    }

    return '';
  };

  const handleDataSource: () => TransactionComplete[] = () => {
    if (findByIdData) return [findByIdData];
    if (data) return data;
    return [];
  };

  const rowHandler = handleDataSource().map((x) => {
    return (
      <Tr key={x.id}>
        <TextCell text={x.id.toString()} />
        <DateCell date={x.createdAt} />

        <TextCell text={handleTransactionConcept(x)} />
        <MoneyCell objectKey={'transactionAmount'} data={x} />
        <TextCell text={x.account.displayName} />
        <TextCell text={x.moneyAccount.displayName} />

        <RowOptionsModTransactions {...x} />
      </Tr>
    );
  });

  return (
    <>
      <DynamicTable
        title={'Transacciones'}
        searchBar={
          <TableSearchbar
            type="number"
            placeholder="Buscar por ID"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        }
        headers={[
          'ID',
          'F. Creacion',
          'Concepto',
          'Monto',
          'Creador',
          'Cuenta',
          'Opciones',
        ]}
        rows={rowHandler}
        loading={findIsLoading}
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

export default TransactionsPage;
