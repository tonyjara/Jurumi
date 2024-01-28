import { createColumnHelper } from "@tanstack/react-table";
import DateCell from "@/components/DynamicTables/DynamicCells/DateCell";
import EnumTextCell from "@/components/DynamicTables/DynamicCells/EnumTextCell";
import MoneyCell from "@/components/DynamicTables/DynamicCells/MoneyCell";
import TextCell from "@/components/DynamicTables/DynamicCells/TextCell";
import { ApprovalUtils } from "@/lib/utils/ApprovalUtilts";
import {
  translatedMoneyReqStatus,
  translatedMoneyReqType,
} from "@/lib/utils/TranslatedEnums";
import { MonyRequestCompleteWithApproval } from "./mod.approvals.types";
import MoneyRequestOperationDateChangeCell from "@/components/DynamicTables/DynamicCells/MoneyRequestOperationDateChangeCell";

const columnHelper = createColumnHelper<MonyRequestCompleteWithApproval>();

export const modApprovalsColumns = ({
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

  columnHelper.accessor("operationDate", {
    cell: (x) => (
      <MoneyRequestOperationDateChangeCell
        date={x.getValue()}
        id={x.row.original.id}
      />
    ),
    header: "Fecha de Operación",
    sortingFn: "datetime",
  }),
  columnHelper.display({
    header: "Aprobación",
    cell: (x) => {
      const { needsApproval, approverNames, approvalText } = ApprovalUtils(
        x.row.original as any,
      );
      return (
        <TextCell
          text={needsApproval() ? approvalText : "No req."}
          hover={approverNames}
        />
      );
    },
  }),
  columnHelper.accessor("status", {
    header: "Estado de depósito",
    cell: (x) => (
      <EnumTextCell
        text={x.getValue()}
        enumFunc={translatedMoneyReqStatus}
        hover={x.row.original.rejectionMessage}
      />
    ),
  }),
  columnHelper.accessor("moneyRequestType", {
    header: "Tipo",
    cell: (x) => (
      <EnumTextCell text={x.getValue()} enumFunc={translatedMoneyReqType} />
    ),
  }),
  columnHelper.accessor("description", {
    cell: (x) => (
      <TextCell text={x.getValue()} shortenString hover={x.getValue()} />
    ),
    header: "Desc.",
  }),
  columnHelper.accessor("amountRequested", {
    header: "Monto",
    cell: (x) => (
      <MoneyCell amount={x.getValue()} currency={x.row.original.currency} />
    ),
  }),
  columnHelper.accessor("account.displayName", {
    header: "Creador",
    cell: (x) => <TextCell text={x.getValue()} />,
  }),
  columnHelper.display({
    header: "Proyecto",
    cell: (x) => (
      <TextCell text={x.row.original?.project?.displayName ?? "-"} />
    ),
  }),

  columnHelper.accessor("id", {
    header: "ID",
    cell: (x) => <TextCell text={x.getValue()} />,
  }),
];
