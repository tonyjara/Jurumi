import { createColumnHelper } from "@tanstack/react-table";
import TextCell from "@/components/DynamicTables/DynamicCells/TextCell";
import { Prisma } from "@prisma/client";
import MoneyCell from "@/components/DynamicTables/DynamicCells/MoneyCell";
import PercentageCell from "@/components/DynamicTables/DynamicCells/PercentageCell";
import { CostCategoryReport } from "../project.types";

const columnHelper = createColumnHelper<CostCategoryReport>();

export const projectReportsColumn = ({
  pageIndex,
  pageSize,
}: {
  pageSize: number;
  pageIndex: number;
}) => [
  columnHelper.display({
    header: "N.",
    cell: (x) => x.row.index + 1 + pageIndex * pageSize,
    footer: () => <TextCell text="Total" />,
  }),
  columnHelper.accessor("displayName", {
    header: "Linea Presupuestaria",
    cell: (x) => <TextCell text={x.getValue()} />,
  }),

  columnHelper.display({
    header: "Total asignado en Dólares",
    cell: (x) => {
      const row = x.row.original;
      function amount() {
        if (row.currency === "PYG") {
          return row.referenceExchangeRate > 0
            ? row.assignedAmount.dividedBy(row.referenceExchangeRate)
            : new Prisma.Decimal(0);
        }
        return row.assignedAmount;
      }

      return <MoneyCell currency="USD" amount={amount()} />;
    },
    footer: ({ table }) => {
      const rows = table.getFilteredRowModel().rows;

      const total = rows.reduce((acc, { original: row }) => {
        if (row.currency === "PYG") {
          return acc.add(
            row.referenceExchangeRate > 0
              ? row.assignedAmount.dividedBy(row.referenceExchangeRate)
              : new Prisma.Decimal(0)
          );
        }
        return acc.add(row.assignedAmount);
      }, new Prisma.Decimal(0));

      return <MoneyCell currency="USD" amount={total} />;
    },
  }),
  columnHelper.display({
    header: "Total Ejecutado en USD",
    cell: (x) => {
      const row = x.row.original;
      const transaction = row?.transactions.at(0) ?? null;

      function amount() {
        if (!transaction) return new Prisma.Decimal(0);
        if (transaction.currency === "PYG") {
          return transaction.currentBalance.dividedBy(
            row.referenceExchangeRate > 0 ? row.referenceExchangeRate : 1
          );
        }
        return transaction.currentBalance;
      }

      return <MoneyCell currency="USD" amount={amount()} />;
      /* return <MoneyCell currency="USD" amount={new Prisma.Decimal(0)} />; */
    },

    footer: ({ table }) => {
      const rows = table.getFilteredRowModel().rows;

      const total = rows.reduce((acc, { original: row }) => {
        const transaction = row?.transactions ? row.transactions[0] : null;
        if (!transaction) return acc;
        if (transaction.currency === "PYG") {
          return acc.add(
            transaction.currentBalance.dividedBy(
              row.referenceExchangeRate > 0 ? row.referenceExchangeRate : 1
            )
          );
        }
        return acc.add(transaction.currentBalance);
      }, new Prisma.Decimal(0));

      return <MoneyCell currency="USD" amount={total} />;
    },
  }),
  columnHelper.display({
    header: "Saldo en Dólares",
    cell: (x) => {
      const row = x.row.original;
      const transaction = row?.transactions ? row.transactions[0] : null;
      function assigneInDolars() {
        if (row.currency === "PYG") {
          return row.referenceExchangeRate > 0
            ? row.assignedAmount.dividedBy(row.referenceExchangeRate)
            : new Prisma.Decimal(0);
        }
        return row.assignedAmount;
      }

      function amount() {
        if (!transaction) return new Prisma.Decimal(0);
        if (transaction.currency === "PYG") {
          return row.referenceExchangeRate > 0
            ? transaction.currentBalance.dividedBy(row.referenceExchangeRate)
            : new Prisma.Decimal(0);
        }
        return transaction.currentBalance;
      }

      return (
        <MoneyCell currency="USD" amount={assigneInDolars().sub(amount())} />
      );
    },
    footer: ({ table }) => {
      const rows = table.getFilteredRowModel().rows;

      const total = rows.reduce((acc, { original: row }) => {
        const transaction = row?.transactions ? row.transactions[0] : null;
        if (!transaction) return acc;
        function assigneInDolars() {
          if (row.currency === "PYG") {
            return row.referenceExchangeRate > 0
              ? row.assignedAmount.dividedBy(row.referenceExchangeRate)
              : new Prisma.Decimal(0);
          }
          return row.assignedAmount;
        }

        function amount() {
          if (!transaction) return new Prisma.Decimal(0);
          if (transaction.currency === "PYG") {
            return row.referenceExchangeRate > 0
              ? transaction.currentBalance.dividedBy(row.referenceExchangeRate)
              : new Prisma.Decimal(0);
          }
          return transaction.currentBalance;
        }

        return acc.add(assigneInDolars().sub(amount()));
      }, new Prisma.Decimal(0));

      return <MoneyCell currency="USD" amount={total} />;
    },
  }),
  columnHelper.display({
    header: "Porcentaje",
    cell: (x) => {
      const row = x.row.original;
      const transaction = row?.transactions ? row.transactions[0] : null;
      function assigneInDolars() {
        if (row.currency === "PYG") {
          return row.assignedAmount.dividedBy(row.referenceExchangeRate);
        }
        return row.assignedAmount;
      }

      function amount() {
        if (!transaction) return new Prisma.Decimal(0);
        if (transaction.currency === "PYG") {
          return transaction.currentBalance.dividedBy(
            row.referenceExchangeRate
          );
        }
        return transaction.currentBalance;
      }

      return (
        <PercentageCell
          currency="USD"
          total={assigneInDolars()}
          executed={amount()}
        />
      );
    },
  }),
  columnHelper.display({
    header: "Saldo en Guaranies",
    cell: (x) => {
      const row = x.row.original;
      const transaction = row?.transactions ? row.transactions[0] : null;
      function assignedInGs() {
        if (row.currency === "USD") {
          return row.assignedAmount.times(row.referenceExchangeRate);
        }
        return row.assignedAmount;
      }

      function amount() {
        if (!transaction) return new Prisma.Decimal(0);
        if (transaction.currency === "USD") {
          return transaction.currentBalance.times(row.referenceExchangeRate);
        }
        return transaction.currentBalance;
      }

      return <MoneyCell currency="PYG" amount={assignedInGs().sub(amount())} />;
    },
    footer: ({ table }) => {
      const rows = table.getFilteredRowModel().rows;

      const total = rows.reduce((acc, { original: row }) => {
        const transaction = row?.transactions ? row.transactions[0] : null;
        if (!transaction) return acc;
        function assignedInGs() {
          if (row.currency === "USD") {
            return row.assignedAmount.times(row.referenceExchangeRate);
          }
          return row.assignedAmount;
        }

        function amount() {
          if (!transaction) return new Prisma.Decimal(0);
          if (transaction.currency === "USD") {
            return transaction.currentBalance.times(row.referenceExchangeRate);
          }
          return transaction.currentBalance;
        }

        return acc.add(assignedInGs().sub(amount()));
      }, new Prisma.Decimal(0));

      return <MoneyCell currency="PYG" amount={total} />;
    },
  }),
];
