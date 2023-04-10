import { useDisclosure } from "@chakra-ui/react";
import type { ExpenseReport } from "@prisma/client";
import React, { useEffect, useState } from "react";
import type { TableOptions } from "@/components/DynamicTables/DynamicTable";
import DynamicTable from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import TableSearchbar from "@/components/DynamicTables/Utils/TableSearchbar";
import EditExpenseReportModal from "@/components/Modals/expenseReport.edit.modal";
import { trpcClient } from "@/lib/utils/trpcClient";
import { modExpenseReportsColumns } from "./columns.mod.expense-reports";
import RowOptionsHomeExpenseReports from "./rowOptions.mod.expense-reports";

export type ExpenseReportComplete = ExpenseReport & {
    project: {
        id: string;
        displayName: string;
    } | null;
    account: {
        id: string;
        displayName: string;
    };
    searchableImage: {
        url: string;
        imageName: string;
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
};

const ModExpenseReportsPage = () => {
    const [searchValue, setSearchValue] = useState("");
    const [editExpenseReport, setEditExpenseReport] =
        useState<ExpenseReportComplete | null>(null);
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
        return () => { };
    }, [editExpenseReport, isEditOpen]);

    const { data: expenseReports, isFetching } =
        trpcClient.expenseReport.getManyComplete.useQuery(
            { pageIndex, pageSize, sorting: globalFilter ? sorting : null },
            { keepPreviousData: globalFilter ? true : false }
        );
    const { data: count } = trpcClient.expenseReport.count.useQuery();

    const handleDataSource = () => {
        if (!expenseReports) return [];
        // if (findByIdData) return [findByIdData];
        if (expenseReports) return expenseReports;
        return [];
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

    const rowOptionsFunction = (x: ExpenseReportComplete) => {
        return (
            <RowOptionsHomeExpenseReports
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
                /* searchBar={ */
                /*     <TableSearchbar */
                /*         type="text" */
                /*         placeholder="Buscar por ID" */
                /*         searchValue={searchValue} */
                /*         setSearchValue={setSearchValue} */
                /*     /> */
                /* } */
                rowOptions={rowOptionsFunction}
                options={tableOptions}
                loading={isFetching}
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
