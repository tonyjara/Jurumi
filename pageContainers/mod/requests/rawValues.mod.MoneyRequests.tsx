import { ApprovalUtils } from "@/lib/utils/ApprovalUtilts";
import { Table } from "@tanstack/react-table";
import { MoneyRequestComplete } from "./mod.requests.types";

export const rawValuesModMoneyRequests = ({
  table,
}: {
  table: Table<MoneyRequestComplete>;
}) => {
  /* Fecha, nombre del proveedor concepto e importe */
  return table.getRowModel().rows.map((Row, rowIndex) => {
    return Row.getVisibleCells().map((cell) => {
      const header = cell.column.columnDef.header;
      const row = Row.original as MoneyRequestComplete;
      if (header == "N.") {
        return {
          type: Number,
          value: rowIndex + 1,
          width: 5,
        };
      }

      if (header === "Fecha de Creación") {
        return {
          type: Date,
          value: row.createdAt,
          format: "dd/mm/yyyy",
        };
      }
      if (header === "Fecha de Operación") {
        return {
          type: Date,
          value: row.operationDate,
          format: "dd/mm/yyyy",
        };
      }

      if (header === "Aprobación") {
        const { approvalText } = ApprovalUtils(row as any);
        return {
          type: String,
          value: approvalText,
        };
      }
      if (header === "Proyecto") {
        return {
          type: String,
          value: row.project?.displayName,
          width: 40,
        };
      }
      if (header === "Linea Presupuestaria") {
        return {
          type: String,
          value: row.costCategory?.displayName,
          width: 40,
        };
      }

      if (header === "ID") {
        return {
          type: String,
          value: row.id,
          width: 40,
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
