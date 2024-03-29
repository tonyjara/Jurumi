import { createColumnHelper } from "@tanstack/react-table";
import DateCell from "@/components/DynamicTables/DynamicCells/DateCell";
import TextCell from "@/components/DynamicTables/DynamicCells/TextCell";
import type { FormTaxPayer } from "@/lib/validations/taxtPayer.validate";

const columnHelper = createColumnHelper<FormTaxPayer>();

export const taxpayersColumns = ({
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
      <TextCell
        text={
          x.row.original.fantasyName?.length ? x.row.original.fantasyName : "-"
        }
      />
    ),
    header: "N. de Fantasía",
  }),
  columnHelper.accessor("razonSocial", {
    cell: (x) => <TextCell text={x.getValue()} />,
    header: "Razón Social",
  }),
  columnHelper.accessor("ruc", {
    cell: (x) => <TextCell text={x.getValue()} />,
    header: "R.U.C.",
  }),
];
