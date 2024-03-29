import { useDisclosure } from "@chakra-ui/react";
import type { Prisma, Transaction } from "@prisma/client";
import type { SortingState } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import type {
  RowOptionsType,
  TableOptions,
} from "@/components/DynamicTables/DynamicTable";
import DynamicTable from "@/components/DynamicTables/DynamicTable";
import EditTransactionModal from "@/components/Modals/Transaction.edit.modal";
import { modTransactionsColumns } from "./columns.mod.transactions";
import RowOptionsModTransactions from "./rowOptions.mod.transactions";
import { TransactionComplete } from "./transactions.types";
import { rawValuesTransactions } from "./rawValues.transactions";

const TransactionsTable = ({
  data,
  searchBar,
  loading,
  count,
  dynamicTableProps,
  whereFilterList,
  setWhereFilterList,
}: {
  data: TransactionComplete[];
  searchBar?: React.ReactNode;
  loading: boolean;
  count?: number;
  whereFilterList: Prisma.TransactionScalarWhereInput[];
  setWhereFilterList: React.Dispatch<
    React.SetStateAction<Prisma.TransactionScalarWhereInput[]>
  >;
  dynamicTableProps: {
    pageIndex: number;
    setPageIndex: React.Dispatch<React.SetStateAction<number>>;
    pageSize: number;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    sorting: SortingState;
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  };
}) => {
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    null,
  );

  const { pageIndex, pageSize } = dynamicTableProps;

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

  const rowOptionsFunction: RowOptionsType = ({ x, setMenuData }) => {
    return (
      <RowOptionsModTransactions
        x={x}
        setMenuData={setMenuData}
        setEditTransaction={setEditTransaction}
        onEditOpen={onEditOpen}
      />
    );
  };

  return (
    <>
      <DynamicTable
        title={"Transacciones"}
        enableColumnFilters={true}
        rawValuesDictionary={rawValuesTransactions}
        whereFilterList={whereFilterList}
        setWhereFilterList={setWhereFilterList}
        searchBar={searchBar}
        loading={loading}
        columns={modTransactionsColumns({
          pageIndex,
          pageSize,
        })}
        rowOptions={rowOptionsFunction}
        data={data}
        count={count ?? 0}
        {...dynamicTableProps}
        colorRedKey={["cancellationId", "isCancellation"]}
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
