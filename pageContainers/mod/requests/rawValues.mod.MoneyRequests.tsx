import { ApprovalUtils } from "@/lib/utils/ApprovalUtilts";
import { Table } from "@tanstack/react-table";
import { MoneyRequestComplete } from "./mod.requests.types";
import { Cell, Row, SheetData } from "write-excel-file";
import {
  translatedMoneyReqStatus,
  translatedMoneyReqType,
} from "@/lib/utils/TranslatedEnums";
import {
  reduceExpenseReportsToSetCurrency,
  reduceExpenseReturnsToSetCurrency,
} from "@/lib/utils/TransactionUtils";
import { percentageCellUtil } from "@/components/DynamicTables/DynamicCells/PercentageCell";

export const rawValuesModMoneyRequests = ({
  table,
}: {
  table: Table<MoneyRequestComplete>;
}) => {
  return table.getRowModel().rows.map((Row, rowIndex) => {
    return Row.getVisibleCells().map((cell) => {
      const header = cell.column.columnDef.header;
      const row = Row.original as MoneyRequestComplete;
      if (header == "N°") {
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

export const rawValuesModMoneyRequestsUnpaginated = <T extends object>({
  data,
  table,
}: {
  data: MoneyRequestComplete[];
  table: Table<T>;
}) => {
  return data.map((row, index) => {
    let sheet: Cell[] = [];

    table.getFlatHeaders().map((h) => {
      const header = h.column.columnDef.header as string;

      if (header == "N°") {
        return sheet.push({
          type: String,
          value: row.wasCancelled ? "ANULADO" : (index + 1).toString(),
        });
      }

      if (header === "O.P. N°") {
        return sheet.push({
          type: String,
          value: `${
            row.project
              ? row.project.acronym
                ? row.project.acronym
                : "SS"
              : "SP"
          }-${row?.moneyOrderNumber?.toLocaleString("en-US") ?? ""}`,
        });
      }
      if (header === "Fecha de Creación") {
        return sheet.push({
          type: Date,
          value: row.createdAt,
          format: "dd/mm/yyyy",
        });
      }
      if (header === "Fecha de Operación" && row.operationDate) {
        return sheet.push({
          type: Date,
          value: row.operationDate,
          format: "dd/mm/yyyy",
        });
      }

      if (header === "Aprobación") {
        const { approvalText } = ApprovalUtils(row as any);
        return sheet.push({
          type: String,
          value: approvalText,
        });
      }
      if (header === "Estado") {
        return sheet.push({
          type: String,
          value: translatedMoneyReqStatus(row.status),
        });
      }
      if (header === "Tipo") {
        return sheet.push({
          type: String,
          value: translatedMoneyReqType(row.moneyRequestType),
        });
      }
      if (header === "Monto") {
        return sheet.push({
          type: Number,
          value: row.amountRequested.toNumber(),
        });
      }
      if (header === "Creador") {
        return sheet.push({
          type: String,
          value: row.account.displayName,
        });
      }
      if (header === "Proyecto") {
        return sheet.push({
          type: String,
          value: row.project?.displayName,
        });
      }
      if (header === "Linea Presupuestaria") {
        return sheet.push({
          type: String,
          value: row.costCategory?.displayName,
        });
      }
      if (header === "Concepto") {
        return sheet.push({
          type: String,
          value: row.description,
        });
      }
      if (header === "Comentarios") {
        return sheet.push({
          type: String,
          value: row.comments,
        });
      }
      if (header === "Ejecutado") {
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
        return sheet.push({
          type: String,
          value: `${percentageCellUtil(executed, total)}%`,
        });
      }
      if (header === "Rendido") {
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
        return sheet.push({
          type: String,
          value:
            row.moneyRequestType === "REIMBURSMENT_ORDER"
              ? "-"
              : `${percentageCellUtil(executed, total)}%`,
        });
      }

      if (header === "ID") {
        return sheet.push({
          type: String,
          value: row.id,
        });
      }

      // Header that wasn't catched
      return sheet.push({
        type: String,
        value: "-",
      });
    });
    return sheet;
  });
};
/* const headers = [ */
/**/
/* "Fecha de Creación",	"Fecha de Operación",	"Aprobación"	Estado	Tipo	Monto	Creador	Proyecto	Linea Presupuestaria	Concepto	Comentarios	Ejecutado	Rendido	ID */
/* ] */
