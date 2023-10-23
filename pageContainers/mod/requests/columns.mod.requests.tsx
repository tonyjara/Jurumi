import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import DateCell from "@/components/DynamicTables/DynamicCells/DateCell";
import EnumTextCell from "@/components/DynamicTables/DynamicCells/EnumTextCell";
import MoneyCell from "@/components/DynamicTables/DynamicCells/MoneyCell";
import PercentageCell, {
  percentageCellUtil,
} from "@/components/DynamicTables/DynamicCells/PercentageCell";
import TextCell from "@/components/DynamicTables/DynamicCells/TextCell";
import { ApprovalUtils } from "@/lib/utils/ApprovalUtilts";
import {
  reduceExpenseReportsToSetCurrency,
  reduceExpenseReturnsToSetCurrency,
  reduceTransactionAmountsToSetCurrency,
} from "@/lib/utils/TransactionUtils";
import {
  translatedMoneyReqStatus,
  translatedMoneyReqType,
} from "@/lib/utils/TranslatedEnums";
import { Center } from "@chakra-ui/react";
import SearchableImageModalCell from "@/components/DynamicTables/DynamicCells/SearchableImagesModalCell";
import SelectCheckBoxCell from "@/components/DynamicTables/DynamicCells/SelectCheckBoxCell";
import HeaderSelectCheckBox from "@/components/DynamicTables/DynamicCells/HeaderSelectCheckBox";
import { MoneyRequestComplete } from "./mod.requests.types";
import MoneyRequestOperationDateChangeCell from "@/components/DynamicTables/DynamicCells/MoneyRequestOperationDateChangeCell";
import OpNumberCell from "@/components/DynamicTables/DynamicCells/OpNumberCell";

const columnHelper = createColumnHelper<MoneyRequestComplete>();

export const moneyRequestsColumns = ({
  pageIndex,
  pageSize,
  selectedRows,
  setSelectedRows,
  rowsLength,
}: {
  pageSize: number;
  pageIndex: number;
  selectedRows: any[];
  setSelectedRows: (rows: any[]) => void;
  rowsLength: number;
}): ColumnDef<MoneyRequestComplete, any>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <HeaderSelectCheckBox
        rowsLength={rowsLength}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        table={table}
        pageSize={pageSize}
      />
    ),
    cell: ({ row }) => (
      <SelectCheckBoxCell
        row={row}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
    ),
  },

  columnHelper.display({
    cell: (x) => x.row.index + 1 + pageIndex * pageSize,
    header: "N°",
  }),
  columnHelper.accessor("moneyOrderNumber", {
    cell: (x) => (x.getValue() ? <OpNumberCell row={x.row.original} /> : "-"),
    header: "O.P. N°",
  }),
  columnHelper.accessor("createdAt", {
    cell: (x) => <DateCell date={x.getValue()} />,
    header: "Fecha de Creación",
    sortingFn: "datetime",
  }),

  columnHelper.accessor("operationDate", {
    cell: (x) => (
      <MoneyRequestOperationDateChangeCell
        date={x.getValue()}
        id={x.row.original.id}
      />
    ),
    header: "Fecha de Operación",
    sortingFn: "datetime",
  }),
  columnHelper.display({
    cell: (x) => {
      const { needsApproval, approvalText, approverNames } = ApprovalUtils(
        x.row.original as any,
      );
      return (
        <TextCell
          text={needsApproval() ? approvalText : "No req."}
          hover={approverNames}
        />
      );
    },
    header: "Aprobación",
  }),
  columnHelper.accessor("status", {
    header: "Estado",
    cell: (x) => (
      <EnumTextCell
        text={x.getValue()}
        enumFunc={translatedMoneyReqStatus}
        hover={x.row.original.rejectionMessage}
      />
    ),
  }),
  columnHelper.accessor("moneyRequestType", {
    header: "Tipo",
    cell: (x) => (
      <EnumTextCell text={x.getValue()} enumFunc={translatedMoneyReqType} />
    ),
  }),
  columnHelper.accessor("amountRequested", {
    header: "Monto",
    cell: (x) => (
      <MoneyCell amount={x.getValue()} currency={x.row.original.currency} />
    ),
  }),
  columnHelper.accessor("account.displayName", {
    header: "Creador",
    cell: (x) => <TextCell text={x.getValue()} />,
  }),
  columnHelper.display({
    header: "Proyecto",
    cell: (x) => (
      <TextCell text={x.row.original?.project?.displayName ?? "-"} />
    ),
  }),
  columnHelper.display({
    cell: (x) => (
      <TextCell text={x.row.original.costCategory?.displayName ?? "-"} />
    ),
    header: "Linea Presupuestaria",
  }),
  columnHelper.accessor("description", {
    header: "Concepto",
    cell: (x) => (
      <TextCell text={x.getValue()} shortenString hover={x.getValue()} />
    ),
  }),
  columnHelper.accessor("comments", {
    header: "Comentarios",
    cell: (x) => (
      <TextCell
        text={x.getValue().length ? x.getValue() : "-"}
        shortenString
        hover={x.getValue()}
      />
    ),
  }),
  columnHelper.display({
    header: "Ejecutado",
    cell: (x) => (
      <PercentageCell
        total={x.row.original.amountRequested}
        executed={reduceTransactionAmountsToSetCurrency({
          transactions: x.row.original.transactions,
          currency: x.row.original.currency,
        })}
        currency={x.row.original.currency}
      />
    ),
  }),
  columnHelper.accessor(
    (row) => {
      const total = row.amountRequested;
      const executed = reduceExpenseReportsToSetCurrency({
        expenseReports: row.expenseReports,
        currency: row.currency,
      }).add(
        reduceExpenseReturnsToSetCurrency({
          expenseReturns: row.expenseReturns,
          currency: row.currency,
        }),
      );

      return percentageCellUtil(executed, total);
    },
    {
      id: "no-global-sort",
      header: "Rendido",

      cell: (x) => {
        const total = x.row.original.amountRequested;
        const executed = reduceExpenseReportsToSetCurrency({
          expenseReports: x.row.original.expenseReports,
          currency: x.row.original.currency,
        }).add(
          reduceExpenseReturnsToSetCurrency({
            expenseReturns: x.row.original.expenseReturns,
            currency: x.row.original.currency,
          }),
        );

        return (
          <Center>
            {x.row.original.moneyRequestType === "REIMBURSMENT_ORDER" && (
              <SearchableImageModalCell
                searchableImages={x.row.original.searchableImages}
              />
            )}

            {(x.row.original.moneyRequestType === "FUND_REQUEST" ||
              x.row.original.moneyRequestType === "MONEY_ORDER") && (
              <PercentageCell
                total={total}
                executed={executed}
                currency={x.row.original.currency}
              />
            )}
          </Center>
        );
      },
    },
  ),
  columnHelper.accessor("id", {
    header: "ID",
    cell: (x) => <TextCell text={x.getValue()} />,
  }),
];
