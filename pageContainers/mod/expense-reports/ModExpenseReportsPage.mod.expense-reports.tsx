import { useDisclosure } from "@chakra-ui/react";
import type { Prisma } from "@prisma/client";
import React, { useEffect, useState } from "react";
import type {
  RowOptionsType,
  TableOptions,
} from "@/components/DynamicTables/DynamicTable";
import DynamicTable from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import TableSearchbar from "@/components/DynamicTables/Utils/TableSearchbar";
import EditExpenseReportModal from "@/components/Modals/expenseReport.edit.modal";
import { trpcClient } from "@/lib/utils/trpcClient";
import { modExpenseReportsColumns } from "./columns.mod.expense-reports";
import RowOptionsHomeExpenseReports from "./rowOptions.mod.expense-reports";
import { ExpenseReportsPageProps } from "@/pages/mod/expense-reports";
import useDebounce from "@/lib/hooks/useDebounce";
import {
  HomeExpenseReportComplete,
  ModExpenseReportComplete,
} from "../requests/expenseReport.types";

const ModExpenseReportsPage = ({
  query,
  taxPayerId,
}: {
  query?: ExpenseReportsPageProps;
  taxPayerId?: string;
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [whereFilterList, setWhereFilterList] = useState<
    Prisma.MoneyRequestScalarWhereInput[]
  >([]);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [filterValue, setFilterValue] = useState("id");
  const [editExpenseReport, setEditExpenseReport] = useState<
    ModExpenseReportComplete | HomeExpenseReportComplete | null
  >(null);
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, pageSize, sorting } = dynamicTableProps;

  //Used when selecting a taxPayer in movimientosPage
  useEffect(() => {
    if (taxPayerId === undefined) return;
    setWhereFilterList((prev) => prev.filter((x) => !x.taxPayerId));
    if (taxPayerId === "") return;
    setWhereFilterList((prev) => [...prev, { taxPayerId }]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxPayerId]);

  useEffect(() => {
    if (query?.expenseReportsIds) {
      setSearchValue(String(query.expenseReportsIds) ?? "");
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
    if (!isEditOpen && editExpenseReport) {
      setEditExpenseReport(null);
    }
    return () => {};
  }, [editExpenseReport, isEditOpen]);

  const { data: expenseReports, isFetching } =
    trpcClient.expenseReport.getManyComplete.useQuery({
      pageIndex,
      pageSize,
      sorting,
      whereFilterList,
    });

  const { data: findByIdData, isFetching: isFetchingById } =
    trpcClient.expenseReport.findCompleteModById.useQuery(
      { ids: searchValue.split(","), whereFilterList },
      { enabled: searchValue.length > 0 },
    );

  const { data: count } = trpcClient.expenseReport.count.useQuery({
    whereFilterList,
  });

  const handleDataSource = () => {
    if (!expenseReports) return [];
    if (findByIdData) return findByIdData;
    if (expenseReports) return expenseReports;
    return [];
  };

  const rowOptionsFunction: RowOptionsType = ({ x, setMenuData }) => {
    return (
      <RowOptionsHomeExpenseReports
        setMenuData={setMenuData}
        x={x}
        onEditOpen={onEditOpen}
        setEditExpenseReport={setEditExpenseReport}
      />
    );
  };

  return (
    <>
      <DynamicTable
        title={"Rendiciones"}
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
        loading={isFetching || isFetchingById}
        columns={modExpenseReportsColumns({
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

export default ModExpenseReportsPage;
