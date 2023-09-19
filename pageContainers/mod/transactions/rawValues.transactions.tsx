import { formatedFacturaNumber } from "@/lib/utils/FacturaUtils";
import { handleTransactionConcept } from "@/lib/utils/TransactionUtils";
import { Table } from "@tanstack/react-table";
import { TransactionComplete } from "./transactions.types";

export const rawValuesTransactions = ({
  table,
}: {
  table: Table<TransactionComplete>;
}) => {
  return table.getRowModel().rows.map((Row, rowIndex) => {
    return Row.getVisibleCells().map((cell) => {
      const header = cell.column.columnDef.header;
      const row = Row.original as TransactionComplete;
      if (header == "N.") {
        return {
          type: Number,
          value: rowIndex + 1,
          width: 5,
        };
      }

      if (header === "Num") {
        return {
          type: Number,
          value: row.id,
          width: 40,
        };
      }
      if (header === "Fecha de Creación") {
        return {
          type: Date,
          value: row.createdAt,
          format: "dd/mm/yyyy",
        };
      }

      if (header === "Cuenta") {
        return {
          type: String,
          value: row.moneyAccount?.displayName,
        };
      }

      if (header === "Concepto") {
        return {
          type: String,
          value: handleTransactionConcept(row),
          width: 40,
        };
      }
      if (header === "Proyecto") {
        return {
          type: String,
          value: row.project?.displayName,
          width: 100,
        };
      }
      if (header === "Linea Presupuestaria") {
        return {
          type: String,
          value: row.costCategory?.displayName,
          width: 40,
        };
      }
      if (header === "Comprobante") {
        return {
          type: String,
          value: row.searchableImage?.url,
          width: 40,
        };
      }
      if (header === "A la orden de") {
        return {
          type: String,
          value: row.expenseReport?.taxPayer.razonSocial,
          width: 40,
        };
      }

      if (header === "Factura Num") {
        return {
          type: String,
          value: formatedFacturaNumber(row.expenseReport?.facturaNumber ?? ""),
          width: 40,
        };
      }
      if (header === "ID") {
        return {
          type: String,
          value: row.id,
          width: 80,
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
