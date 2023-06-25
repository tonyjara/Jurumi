import { useDisclosure } from "@chakra-ui/react";
import type { ExpenseReport, Prisma } from "@prisma/client";
import React, { useEffect, useState } from "react";
import type {
  RowOptionsType,
  TableOptions,
} from "@/components/DynamicTables/DynamicTable";
import DynamicTable from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import EditExpenseReportModal from "@/components/Modals/expenseReport.edit.modal";
import { trpcClient } from "@/lib/utils/trpcClient";
import { expenseReportColums } from "./columns.home.expense-reports";
import RowOptionsHomeExpenseReports from "./rowOptions.home.expense-reports";

export type MyExpenseReport = ExpenseReport & {
  project: {
    id: string;
    displayName: string;
  } | null;
  costCategory: {
    id: string;
    displayName: string;
  } | null;
  taxPayer: {
    fantasyName: string | null;
    razonSocial: string;
    ruc: string;
  };
  searchableImage: {
    url: string;
    imageName: string;
  } | null;
};

const MyExpenseReportsPage = () => {
  const [editExpenseReport, setEditExpenseReport] =
    useState<MyExpenseReport | null>(null);
  const [whereFilterList, setWhereFilterList] = useState<
    Prisma.MoneyRequestScalarWhereInput[]
  >([]);
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, setGlobalFilter, globalFilter, pageSize, sorting } =
    dynamicTableProps;

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  useEffect(() => {
    if (!isEditOpen && editExpenseReport) {
      setEditExpenseReport(null);
    }
    return () => {};
  }, [editExpenseReport, isEditOpen]);

  const { data: expenseReports, isFetching } =
    trpcClient.expenseReport.getMyOwnComplete.useQuery(
      {
        pageIndex,
        pageSize,
        sorting: globalFilter ? sorting : null,
        whereFilterList,
      },
      { keepPreviousData: globalFilter ? true : false }
    );
  const { data: count } = trpcClient.expenseReport.count.useQuery({
    whereFilterList,
  });

  const handleDataSource = () => {
    // if (findByIdData) return [findByIdData];
    return expenseReports ?? [];
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
      <RowOptionsHomeExpenseReports
        x={x}
        onEditOpen={onEditOpen}
        setEditExpenseReport={setEditExpenseReport}
        setMenuData={setMenuData}
      />
    );
  };

  return (
    <>
      <DynamicTable
        title={"Mis Rendiciones"}
        enableColumnFilters={true}
        whereFilterList={whereFilterList}
        setWhereFilterList={setWhereFilterList}
        rowOptions={rowOptionsFunction}
        options={tableOptions}
        loading={isFetching}
        columns={expenseReportColums({
          pageIndex,
          pageSize,
        })}
        data={handleDataSource()}
        count={count ?? 0}
        colorRedKey={["wasCancelled"]}
        {...dynamicTableProps}
      />
      {editExpenseReport && (
        <EditExpenseReportModal
          expenseReport={editExpenseReport}
          isOpen={isEditOpen}
          onClose={onEditClose}
        />
      )}
    </>
  );
};

export default MyExpenseReportsPage;
