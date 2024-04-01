import { createColumnHelper } from "@tanstack/react-table";
import DateCell from "@/components/DynamicTables/DynamicCells/DateCell";
import MoneyCell from "@/components/DynamicTables/DynamicCells/MoneyCell";
import TextCell from "@/components/DynamicTables/DynamicCells/TextCell";
import ImageModalCell from "@/components/DynamicTables/DynamicCells/ImageModalCell";
import EnumTextCell from "@/components/DynamicTables/DynamicCells/EnumTextCell";
import { translateTransactionType } from "@/lib/utils/TranslatedEnums";
import { TransactionComplete } from "./transactions.types";
import { handleTransactionConcept } from "@/lib/utils/TransactionUtils";
import FacturaNumberCell from "@/components/DynamicTables/DynamicCells/FacturaNumberCell";
import TransactionOperationDateChangeCell from "@/components/DynamicTables/DynamicCells/TransactionOperationDateChangeCell";

const columnHelper = createColumnHelper<TransactionComplete>();

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
  columnHelper.display({
    cell: (x) => <TextCell text={x.row.original.id.toString()} />,
    header: "Num",
  }),
  columnHelper.accessor("createdAt", {
    cell: (x) => <DateCell date={x.getValue()} />,
    header: "Fecha de Creación",
    sortingFn: "datetime",
  }),
  columnHelper.accessor("operationDate", {
    cell: (x) => (
      <TransactionOperationDateChangeCell
        date={x.getValue()}
        id={x.row.original.id}
      />
    ),
    header: "Fecha de Operación",
    sortingFn: "datetime",
  }),
  columnHelper.display({
    cell: (x) => (
      <TextCell
        text={handleTransactionConcept(x.row.original)}
        shortenString
        hover={handleTransactionConcept(x.row.original)}
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
    header: "A la orden de",
    cell: (x) => (
      <TextCell
        text={x.row.original.expenseReport?.taxPayer.razonSocial ?? "-"}
      />
    ),
  }),

  columnHelper.display({
    header: "Factura Num",
    cell: (x) => (
      <FacturaNumberCell
        text={x.row.original.expenseReport?.facturaNumber ?? "-"}
      />
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
