import { Tr, useDisclosure } from '@chakra-ui/react';
import type { Transaction } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import DateCell from '../../components/DynamicTables/DynamicCells/DateCell';
import MoneyCell from '../../components/DynamicTables/DynamicCells/MoneyCell';
import TextCell from '../../components/DynamicTables/DynamicCells/TextCell';
import DynamicTable from '../../components/DynamicTables/DynamicTable';
import EditTransactionModal from '../../components/Modals/Transaction.edit.modal';
import { translatedMoneyReqType } from '../../lib/utils/TranslatedEnums';
import RowOptionsModTransactions from './rowOptions.mod.transactions';
import type { TransactionComplete } from './TransactionsPage.mod.transactions';

const TransactionsTable = ({
  data,
  searchBar,
  loading,
}: {
  data: TransactionComplete[];
  searchBar?: React.ReactNode;
  loading: boolean;
}) => {
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    null
  );
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  useEffect(() => {
    if (!isEditOpen && editTransaction) {
      setEditTransaction(null);
    }

    return () => {};
  }, [editTransaction, isEditOpen]);
  const handleTransactionConcept = (x: TransactionComplete) => {
    if (x.moneyRequest) {
      return translatedMoneyReqType(x.moneyRequest.moneyRequestType);
    }

    return '';
  };
  const rowHandler = data.map((x) => {
    return (
      <Tr key={x.id}>
        <TextCell text={x.id.toString()} />
        <DateCell date={x.createdAt} />

        <TextCell text={handleTransactionConcept(x)} />
        <MoneyCell objectKey={'transactionAmount'} data={x} />
        <TextCell text={x.account.displayName} />
        <TextCell text={x.moneyAccount.displayName} />

        <RowOptionsModTransactions
          x={x}
          setEditTransaction={setEditTransaction}
          onEditOpen={onEditOpen}
        />
      </Tr>
    );
  });

  return (
    <>
      <DynamicTable
        title={'Transacciones'}
        searchBar={searchBar}
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
        loading={loading}
      />
      {editTransaction && (
        <EditTransactionModal
          transaction={editTransaction}
          isOpen={isEditOpen}
          onClose={onEditClose}
        />
      )}
    </>
  );
};

export default TransactionsTable;
