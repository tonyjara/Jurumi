import { useDisclosure } from "@chakra-ui/react";
import type { ExpenseReturn, Prisma } from "@prisma/client";
import React, { useEffect, useState } from "react";
import type {
  RowOptionsType,
  TableOptions,
} from "@/components/DynamicTables/DynamicTable";
import DynamicTable from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import TableSearchbar from "@/components/DynamicTables/Utils/TableSearchbar";
import { trpcClient } from "@/lib/utils/trpcClient";
import useDebounce from "@/lib/hooks/useDebounce";
import { modExpenseReturnsColumns } from "./columns.mod.expense-returns";
import RowOptionsHomeExpenseReturns from "./rowOptions.mod.expense-returns";
import { ExpenseReturnsPageProps } from "@/pages/mod/expense-returns";
import EditExpenseReturnModal from "@/components/Modals/ExpenseReturn.edit.modal";

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

const ModExpenseReturnsPage = ({
  query,
}: {
  query: ExpenseReturnsPageProps;
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [whereFilterList, setWhereFilterList] = useState<
    Prisma.MoneyRequestScalarWhereInput[]
  >([]);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [filterValue, setFilterValue] = useState("id");
  const [editExpenseReturn, setEditExpenseReturn] =
    useState<ExpenseReturnComplete | null>(null);
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, setGlobalFilter, globalFilter, pageSize, sorting } =
    dynamicTableProps;

  useEffect(() => {
    if (query.expenseReturnsIds) {
      setSearchValue(String(query.expenseReturnsIds) ?? "");
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const { data: count } = trpcClient.expenseReturn.count.useQuery({
    whereFilterList,
  });
  const { data: expenseReturns, isFetching } =
    trpcClient.expenseReturn.getManyComplete.useQuery(
      {
        pageIndex,
        pageSize,
        sorting: globalFilter ? sorting : null,
        whereFilterList,
      },
      { keepPreviousData: globalFilter ? true : false }
    );

  const { data: findByIdData, isFetching: isFetchingById } =
    trpcClient.expenseReturn.findCompleteById.useQuery(
      { ids: searchValue.split(","), whereFilterList },
      { enabled: searchValue.length > 0 }
    );

  const handleDataSource = () => {
    if (findByIdData) return findByIdData;
    return expenseReturns ?? [];
  };

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
        title={"Devoluciones"}
        enableColumnFilters={true}
        whereFilterList={whereFilterList}
        setWhereFilterList={setWhereFilterList}
        searchBar={
          <TableSearchbar
            type="text"
            placeholder="Buscar por ID"
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            searchValue={debouncedSearchValue}
            setSearchValue={setSearchValue}
          />
        }
        rowOptions={rowOptionsFunction}
        options={tableOptions}
        loading={isFetching || isFetchingById}
        columns={modExpenseReturnsColumns({
          pageIndex,
          pageSize,
        })}
        data={handleDataSource()}
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

export default ModExpenseReturnsPage;
