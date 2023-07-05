import { Prisma } from "@prisma/client";
import { Table } from "@tanstack/react-table";
import { ProjectReportsColumnType } from "./colums.mod.ProjectReports";

export const rawValuesProjectReportsTable = ({
  table,
}: {
  table: Table<ProjectReportsColumnType>;
}) => {
  return table.getRowModel().rows.map((Row, rowIndex) => {
    return Row.getVisibleCells().map((cell) => {
      const header = cell.column.columnDef.header;
      const row = Row.original;
      if (header == "N.") {
        return {
          type: Number,
          value: rowIndex + 1,
        };
      }

      if (header === "Total asignado en Dólares") {
        function amount() {
          if (row.currency === "PYG") {
            return row.referenceExchangeRate > 0
              ? row.assignedAmount.dividedBy(row.referenceExchangeRate)
              : new Prisma.Decimal(0);
          }
          return row.assignedAmount;
        }

        return {
          type: Number,
          value: amount().toNumber(),
        };
      }

      if (header === "Total Ejecutado en USD") {
        const transaction = row?.transactions ? row.transactions[0] : null;

        function amount() {
          if (!transaction) return new Prisma.Decimal(0);
          if (transaction.currency === "PYG") {
            return transaction.currentBalance.dividedBy(
              row.referenceExchangeRate
            );
          }
          return transaction.currentBalance;
        }

        return {
          type: Number,
          value: amount().toDecimalPlaces(2).toNumber(),
        };
      }

      if (header === "Saldo en Dólares") {
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

        return {
          type: Number,
          value: assigneInDolars().sub(amount()).toDecimalPlaces(2).toNumber(),
        };
      }

      if (header === "Porcentaje") {
        const transaction = row?.transactions ? row.transactions[0] : null;
        function total() {
          if (row.currency === "PYG") {
            return row.assignedAmount.dividedBy(row.referenceExchangeRate);
          }
          return row.assignedAmount;
        }

        function executed() {
          if (!transaction) return new Prisma.Decimal(0);
          if (transaction.currency === "PYG") {
            return transaction.currentBalance.dividedBy(
              row.referenceExchangeRate
            );
          }
          return transaction.currentBalance;
        }

        return {
          type: Number,
          value: executed().dividedBy(total()).times(100).floor().toNumber(),
        };
      }

      if (header === "Saldo en Guaranies") {
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

        return {
          type: Number,
          value: assignedInGs().sub(amount()).toDecimalPlaces(0).toNumber(),
        };
      }

      // last return
      return {
        value: cell.getValue(),
        width: 20,
        /* format: null, */
      };
    });
  });
};

/* const DATA_ROW_1 = [ */
/*    // "Name" */
/*    { */
/*      type: String, */
/*      value: "John Smith", */
/*    }, */
/**/
/*    // "Date of Birth" */
/*    { */
/*      type: Date, */
/*      value: new Date(), */
/*      format: "mm/dd/yyyy", */
/*    }, */
/**/
/*    // "Cost" */
/*    { */
/*      type: Number, */
/*      value: 1800, */
/*    }, */
/**/
/*    // "Paid" */
/*    { */
/*      type: Boolean, */
/*      value: true, */
/*    }, */
/*  ]; */
