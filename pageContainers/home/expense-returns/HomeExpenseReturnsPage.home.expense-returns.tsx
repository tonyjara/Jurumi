import { useDisclosure } from "@chakra-ui/react";
import type { ExpenseReturn, Prisma } from "@prisma/client";
import React, { useEffect, useState } from "react";
import type {
  RowOptionsType,
  TableOptions,
} from "@/components/DynamicTables/DynamicTable";
import DynamicTable from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import { trpcClient } from "@/lib/utils/trpcClient";
import EditExpenseReturnModal from "@/components/Modals/ExpenseReturn.edit.modal";
import RowOptionsHomeExpenseReturns from "@/pageContainers/mod/expense-returns/rowOptions.mod.expense-returns";
import { modExpenseReturnsColumns } from "@/pageContainers/mod/expense-returns/columns.mod.expense-returns";
import { homeExpenseReturnsColumns } from "./columns.home.expense-returns";

export type ExpenseReturnComplete = ExpenseReturn & {
  account: {
    id: string;
    displayName: string;
  };
  searchableImage: {
    url: string;
    imageName: string;
  } | null;
};

const HomeExpenseReturnsPage = () => {
  const [whereFilterList, setWhereFilterList] = useState<
    Prisma.MoneyRequestScalarWhereInput[]
  >([]);
  const [editExpenseReturn, setEditExpenseReturn] =
    useState<ExpenseReturnComplete | null>(null);
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, setGlobalFilter, globalFilter, pageSize, sorting } =
    dynamicTableProps;

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  useEffect(() => {
    if (!isEditOpen && editExpenseReturn) {
      setEditExpenseReturn(null);
    }
    return () => {};
  }, [editExpenseReturn, isEditOpen]);

  const { data: count } = trpcClient.expenseReturn.countMyOwn.useQuery({
    whereFilterList,
  });
  const { data: expenseReturns, isFetching } =
    trpcClient.expenseReturn.getMyOwnComplete.useQuery(
      {
        pageIndex,
        pageSize,
        sorting: globalFilter ? sorting : null,
        whereFilterList,
      },
      { keepPreviousData: globalFilter ? true : false }
    );

  const tableOptions: TableOptions[] = [
    {
      onClick: () => setGlobalFilter(true),
      label: `${globalFilter ? "✅" : "❌"} Filtro global`,
    },
    {
      onClick: () => setGlobalFilter(false),
      label: `${!globalFilter ? "✅" : "❌"} Filtro local`,
    },
  ];

  const rowOptionsFunction: RowOptionsType = ({ x, setMenuData }) => {
    return (
      <RowOptionsHomeExpenseReturns
        setMenuData={setMenuData}
        x={x}
        onEditOpen={onEditOpen}
        setEditExpenseReturn={setEditExpenseReturn}
      />
    );
  };

  return (
    <>
      <DynamicTable
        title={"Mis Devoluciones"}
        enableColumnFilters={true}
        whereFilterList={whereFilterList}
        setWhereFilterList={setWhereFilterList}
        rowOptions={rowOptionsFunction}
        options={tableOptions}
        loading={isFetching}
        columns={homeExpenseReturnsColumns({
          pageIndex,
          pageSize,
        })}
        data={expenseReturns ?? []}
        count={count ?? 0}
        colorRedKey={["wasCancelled"]}
        {...dynamicTableProps}
      />
      {editExpenseReturn && (
        <EditExpenseReturnModal
          expenseReturn={editExpenseReturn}
          isOpen={isEditOpen}
          onClose={onEditClose}
        />
      )}
    </>
  );
};

export default HomeExpenseReturnsPage;
