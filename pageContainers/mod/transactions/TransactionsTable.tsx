import { useDisclosure } from '@chakra-ui/react';
import type { Transaction } from '@prisma/client';
import type { SortingState } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import type { TableOptions } from '@/components/DynamicTables/DynamicTable';
import DynamicTable from '@/components/DynamicTables/DynamicTable';
import EditTransactionModal from '@/components/Modals/Transaction.edit.modal';
import { modTransactionsColumns } from './columns.mod.transactions';
import type { TransactionComplete } from './TransactionsPage.mod.transactions';

const TransactionsTable = ({
  data,
  searchBar,
  loading,
  count,
  dynamicTableProps,
}: {
  data: TransactionComplete[];
  searchBar?: React.ReactNode;
  loading: boolean;
  count?: number;
  dynamicTableProps: {
    pageIndex: number;
    setPageIndex: React.Dispatch<React.SetStateAction<number>>;
    pageSize: number;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    sorting: SortingState;
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
    globalFilter: boolean;
    setGlobalFilter: React.Dispatch<React.SetStateAction<boolean>>;
  };
}) => {
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    null
  );
  const { pageIndex, setGlobalFilter, globalFilter, pageSize } =
    dynamicTableProps;

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

  const tableOptions: TableOptions[] = [
    {
      onClick: () => setGlobalFilter(true),
      label: `${globalFilter ? '✅' : '❌'} Filtro global`,
    },
    {
      onClick: () => setGlobalFilter(false),
      label: `${!globalFilter ? '✅' : '❌'} Filtro local`,
    },
  ];

  return (
    <>
      <DynamicTable
        title={'Transacciones'}
        searchBar={searchBar}
        loading={loading}
        columns={modTransactionsColumns({
          onEditOpen,
          setEditTransaction,
          pageIndex,
          pageSize,
        })}
        options={tableOptions}
        data={data}
        count={count ?? 0}
        {...dynamicTableProps}
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
