import { createColumnHelper } from "@tanstack/react-table";
import DateCell from "@/components/DynamicTables/DynamicCells/DateCell";
import EnumTextCell from "@/components/DynamicTables/DynamicCells/EnumTextCell";
import MoneyCell from "@/components/DynamicTables/DynamicCells/MoneyCell";
import PercentageCell from "@/components/DynamicTables/DynamicCells/PercentageCell";
import TextCell from "@/components/DynamicTables/DynamicCells/TextCell";
import {
  reduceExpenseReturnsToSetCurrency,
  reduceExpenseReportsToSetCurrency,
} from "@/lib/utils/TransactionUtils";
import {
  translatedMoneyReqStatus,
  translatedMoneyReqType,
} from "@/lib/utils/TranslatedEnums";
import type { CompleteMoneyReqHome } from "./HomeRequestsPage.home.requests";
import { Center } from "@chakra-ui/react";
import SearchableImageModalCell from "@/components/DynamicTables/DynamicCells/SearchableImagesModalCell";

const columnHelper = createColumnHelper<CompleteMoneyReqHome>();

export const homeRequestsColumns = ({
  pageIndex,
  pageSize,
}: {
  pageSize: number;
  pageIndex: number;
}) => [
  columnHelper.display({
    cell: (x) => x.row.index + 1 + pageIndex * pageSize,
    header: "N.",
  }),
  columnHelper.accessor("createdAt", {
    cell: (x) => <DateCell date={x.getValue()} />,
    header: "Fecha de Creación",
    sortingFn: "datetime",
  }),
  columnHelper.accessor("status", {
    header: "Desembolso",
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
  columnHelper.accessor("description", {
    cell: (x) => (
      <TextCell text={x.getValue()} shortenString hover={x.getValue()} />
    ),
    header: "Concepto",
  }),
  columnHelper.accessor("comments", {
    cell: (x) => (
      <TextCell
        text={x.getValue().length ? x.getValue() : "-"}
        shortenString
        hover={x.getValue()}
      />
    ),
    header: "Comentarios",
  }),
  columnHelper.accessor("amountRequested", {
    header: "Monto",
    cell: (x) => (
      <MoneyCell amount={x.getValue()} currency={x.row.original.currency} />
    ),
  }),
  columnHelper.display({
    header: "Proyecto",
    cell: (x) => (
      <TextCell text={x.row.original?.project?.displayName ?? "-"} />
    ),
  }),
  columnHelper.display({
    header: "Rendido",
    cell: (x) => (
      <Center>
        {x.row.original.moneyRequestType === "REIMBURSMENT_ORDER" ? (
          <SearchableImageModalCell
            searchableImages={x.row.original.searchableImages}
          />
        ) : (
          <PercentageCell
            total={x.row.original.amountRequested}
            executed={reduceExpenseReportsToSetCurrency({
              expenseReports: x.row.original.expenseReports,
              currency: x.row.original.currency,
            }).add(
              reduceExpenseReturnsToSetCurrency({
                expenseReturns: x.row.original.expenseReturns,
                currency: x.row.original.currency,
              })
            )}
            currency={x.row.original.currency}
          />
        )}
      </Center>
    ),
  }),
  columnHelper.accessor("id", {
    header: "ID",
    cell: (x) => <TextCell text={x.getValue()} />,
  }),
];
