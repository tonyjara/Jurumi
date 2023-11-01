import { useDisclosure } from "@chakra-ui/react";
import type { Prisma } from "@prisma/client";
import React, { useEffect, useState } from "react";
import type { RowOptionsType } from "@/components/DynamicTables/DynamicTable";
import DynamicTable from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import EditExpenseReportModal from "@/components/Modals/expenseReport.edit.modal";
import { trpcClient } from "@/lib/utils/trpcClient";
import { expenseReportColums } from "./columns.home.expense-reports";
import RowOptionsHomeExpenseReports from "./rowOptions.home.expense-reports";
import { HomeExpenseReportComplete } from "@/pageContainers/mod/requests/expenseReport.types";

const MyExpenseReportsPage = () => {
  const [editExpenseReport, setEditExpenseReport] =
    useState<HomeExpenseReportComplete | null>(null);
  const [whereFilterList, setWhereFilterList] = useState<
    Prisma.MoneyRequestScalarWhereInput[]
  >([]);
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, pageSize, sorting } = dynamicTableProps;

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
    trpcClient.expenseReport.getMyOwnComplete.useQuery({
      pageIndex,
      pageSize,
      sorting,
      whereFilterList,
    });
  const { data: count } = trpcClient.expenseReport.count.useQuery({
    whereFilterList,
  });

  const handleDataSource = () => {
    // if (findByIdData) return [findByIdData];
    return expenseReports ?? [];
  };

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
