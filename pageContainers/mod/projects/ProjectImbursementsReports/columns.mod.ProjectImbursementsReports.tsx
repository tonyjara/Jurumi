import { createColumnHelper } from "@tanstack/react-table";
import DateCell from "@/components/DynamicTables/DynamicCells/DateCell";
import TextCell from "@/components/DynamicTables/DynamicCells/TextCell";
import { Imbursement, Prisma } from "@prisma/client";
import MoneyCell from "@/components/DynamicTables/DynamicCells/MoneyCell";
import NumberCell from "@/components/DynamicTables/DynamicCells/NumberCell";

const columnHelper = createColumnHelper<Imbursement>();

export const projectImbursementsReportsColumns = ({
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
    cell: (x) => <DateCell hideHours date={x.getValue()} />,
    header: "Fecha de Creación",
    sortingFn: "datetime",
  }),
  columnHelper.accessor("concept", {
    cell: (x) => <TextCell text={x.getValue()} />,
    header: "Concepto",
  }),
  columnHelper.display({
    cell: (x) => {
      const row = x.row.original;
      function receivedindolars() {
        if (row.otherCurrency == "PYG") {
          return row.amountInOtherCurrency.dividedBy(row.exchangeRate);
        }
        return row.amountInOtherCurrency;
      }

      return <MoneyCell currency="USD" amount={receivedindolars()} />;
    },
    header: "Recibido en Dólares",
  }),
  columnHelper.accessor("exchangeRate", {
    cell: (x) => <NumberCell value={x.getValue()} />,
    header: "Tasa de Cambio",
  }),

  columnHelper.display({
    cell: (x) => {
      const row = x.row.original;
      if (row.finalCurrency === "PYG" && row.wasConvertedToOtherCurrency) {
        return <MoneyCell currency="PYG" amount={row.finalAmount} />;
      }
      function receivedInGs() {
        if (row.otherCurrency == "USD") {
          return row.amountInOtherCurrency.times(row.exchangeRate);
        }
        return row.amountInOtherCurrency;
      }

      return <MoneyCell currency="PYG" amount={receivedInGs()} />;
    },
    header: "Recibido en Guaranies",
  }),
];
