import type { CellContext } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import DateCell from "@/components/DynamicTables/DynamicCells/DateCell";
import MoneyCell from "@/components/DynamicTables/DynamicCells/MoneyCell";
import TextCell from "@/components/DynamicTables/DynamicCells/TextCell";
import ImageModalCell from "@/components/DynamicTables/DynamicCells/ImageModalCell";
import EnumTextCell from "@/components/DynamicTables/DynamicCells/EnumTextCell";
import { translateTransactionType } from "@/lib/utils/TranslatedEnums";
import { TransactionComplete } from "./transactions.types";

const columnHelper = createColumnHelper<TransactionComplete>();

const handleTransactionConcept = (
  ctx: CellContext<TransactionComplete, unknown>,
) => {
  const x = ctx.row.original;

  if (x.moneyAccountOffset?.offsetJustification) {
    return x.moneyAccountOffset.offsetJustification;
  }

  if (x.moneyRequest?.description) {
    return x.moneyRequest.description;
  }

  if (x.imbursement?.concept) {
    return x.imbursement.concept;
  }
  // if(x.im)

  return "-";
};

export const modTransactionsColumns = ({
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
  columnHelper.accessor("id", {
    cell: (x) => <TextCell text={x.getValue().toString()} />,
    header: "ID.",
  }),
  columnHelper.accessor("createdAt", {
    cell: (x) => <DateCell date={x.getValue()} />,
    header: "Fecha de Creación",
    sortingFn: "datetime",
  }),
  columnHelper.display({
    cell: (x) => (
      <TextCell
        text={handleTransactionConcept(x)}
        shortenString
        hover={handleTransactionConcept(x)}
      />
    ),
    header: "Concepto",
  }),
  columnHelper.accessor("transactionType", {
    header: "Tipo de Transacción",
    cell: (x) => (
      <EnumTextCell text={x.getValue()} enumFunc={translateTransactionType} />
    ),
  }),
  columnHelper.accessor("transactionAmount", {
    header: "Monto",
    cell: (x) => {
      const arrowDir = () => {
        const tx = x.row.original;
        return tx.currentBalance.gt(tx.openingBalance) ? "up" : "down";
      };

      return (
        <MoneyCell
          arrow={arrowDir()}
          amount={x.getValue()}
          currency={x.row.original.currency}
        />
      );
    },
  }),

  columnHelper.accessor("openingBalance", {
    header: "Monto previo",
    cell: (x) => {
      return (
        <MoneyCell amount={x.getValue()} currency={x.row.original.currency} />
      );
    },
  }),

  columnHelper.accessor("currentBalance", {
    header: "Monto actual",
    cell: (x) => {
      return (
        <MoneyCell amount={x.getValue()} currency={x.row.original.currency} />
      );
    },
  }),
  columnHelper.accessor("account.displayName", {
    header: "Creador",
    cell: (x) => <TextCell text={x.getValue()} />,
  }),
  columnHelper.display({
    header: "Cuenta",
    cell: (x) => (
      <TextCell text={x.row.original.moneyAccount?.displayName ?? "-"} />
    ),
  }),
  columnHelper.display({
    header: "Proyecto",
    cell: (x) => <TextCell text={x.row.original.project?.displayName ?? "-"} />,
  }),
  columnHelper.display({
    header: "Linea Presupuestaria",
    cell: (x) => (
      <TextCell text={x.row.original.costCategory?.displayName ?? "-"} />
    ),
  }),

  columnHelper.display({
    cell: (x) => (
      <ImageModalCell
        imageName={x.row.original.searchableImage?.imageName}
        url={x.row.original.searchableImage?.url}
      />
    ),
    header: "Comprobante",
  }),
  columnHelper.accessor("moneyRequestId", {
    cell: (x) => <TextCell text={x.getValue() || "-"} />,
    header: "Id de Solicitud",
  }),
];
