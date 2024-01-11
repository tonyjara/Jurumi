import { createColumnHelper } from "@tanstack/react-table";
import DateCell from "@/components/DynamicTables/DynamicCells/DateCell";
import TextCell from "@/components/DynamicTables/DynamicCells/TextCell";
import { MonthsInContract } from "../contracts/Monthly/ContractMonthlyRequestsTable";

const columnHelper = createColumnHelper<MonthsInContract>();

export const contractMonthlyColumns = () => [
  columnHelper.accessor("formatedMonth", {
    cell: (x) => <TextCell text={x.getValue()} />,
    header: "Mes",
  }),
  columnHelper.display({
    cell: (x) =>
      x.row.original.request ? (
        <DateCell
          date={
            x.row.original.request?.operationDate
              ? x.row.original.request.operationDate
              : x.row.original.request?.createdAt
          }
        />
      ) : (
        <TextCell text="Pendiente" color={"orange"} />
      ),
    header: "Fecha de operación",
  }),
];
