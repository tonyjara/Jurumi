import type { MoneyAccountOffset } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import BooleanCell from "@/components/DynamicTables/DynamicCells/BooleanCell";
import DateCell from "@/components/DynamicTables/DynamicCells/DateCell";
import TextCell from "@/components/DynamicTables/DynamicCells/TextCell";
import MoneyCell from "@/components/DynamicTables/DynamicCells/MoneyCell";
import { MoneyAccountOffsetComplete } from "./MoneyAccountOffsetsPage.mod.money-account-offset";

const columnHelper = createColumnHelper<MoneyAccountOffsetComplete>();

export const modMoneyAccountOffsetColumn = ({
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

  columnHelper.display({
    cell: (x) => (
      <TextCell shortenString text={x.row.original.account.displayName} />
    ),
    header: "Creador",
  }),
  columnHelper.accessor("offsetJustification", {
    cell: (x) => (
      <TextCell
        shortenString
        hover={x.getValue()}
        text={x.getValue().length ? x.getValue() : "-"}
      />
    ),
    header: "Comentarios",
  }),
  columnHelper.accessor("offsettedAmount", {
    cell: (x) => (
      <MoneyCell amount={x.getValue()} currency={x.row.original.currency} />
    ),
    header: "Monto ajustado",
  }),

  columnHelper.accessor("previousBalance", {
    cell: (x) => (
      <MoneyCell amount={x.getValue()} currency={x.row.original.currency} />
    ),
    header: "Balance Anterior",
  }),

  columnHelper.display({
    cell: (x) => (
      <MoneyCell
        amount={x.row.original.previousBalance.add(
          x.row.original.offsettedAmount
        )}
        currency={x.row.original.currency}
      />
    ),
    header: "Balance Resultante",
  }),
];
