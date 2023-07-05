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
    footer: () => <TextCell text="Total" />,
  }),

  columnHelper.accessor("createdAt", {
    header: "Fecha de Creación",
    cell: (x) => <DateCell hideHours date={x.getValue()} />,
    sortingFn: "datetime",
  }),
  columnHelper.accessor("concept", {
    cell: (x) => <TextCell text={x.getValue()} />,
    header: "Concepto",
  }),
  columnHelper.display({
    header: "Recibido en Dólares",
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
    footer: ({ table }) => {
      const rows = table.getFilteredRowModel().rows;

      const total = rows.reduce((acc, { original: row }) => {
        function receivedindolars() {
          if (row.otherCurrency == "PYG") {
            return row.amountInOtherCurrency.dividedBy(row.exchangeRate);
          }
          return row.amountInOtherCurrency;
        }

        return acc.add(receivedindolars());
      }, new Prisma.Decimal(0));

      return <MoneyCell currency="USD" amount={total} />;
    },
  }),
  columnHelper.accessor("exchangeRate", {
    header: "Tasa de Cambio",
    cell: (x) => <NumberCell value={x.getValue()} />,
  }),

  columnHelper.display({
    header: "Recibido en Guaranies",
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
    footer: ({ table }) => {
      const rows = table.getFilteredRowModel().rows;

      const total = rows.reduce((acc, { original: row }) => {
        if (row.finalCurrency === "PYG" && row.wasConvertedToOtherCurrency) {
          return acc.add(row.finalAmount);
        }
        function receivedInGs() {
          if (row.otherCurrency == "USD") {
            return row.amountInOtherCurrency.times(row.exchangeRate);
          }
          return row.amountInOtherCurrency;
        }

        return acc.add(receivedInGs());
      }, new Prisma.Decimal(0));

      return <MoneyCell currency="PYG" amount={total} />;
    },
  }),
];
