import { createColumnHelper } from "@tanstack/react-table";
import DateCell from "@/components/DynamicTables/DynamicCells/DateCell";
import MoneyCell from "@/components/DynamicTables/DynamicCells/MoneyCell";
import type { imbursementComplete } from "./ImbursementsPage.mod.imbursements";
import BooleanCell from "@/components/DynamicTables/DynamicCells/BooleanCell";
import TextCell from "@/components/DynamicTables/DynamicCells/TextCell";
import ImageModalCell from "@/components/DynamicTables/DynamicCells/ImageModalCell";

const columnHelper = createColumnHelper<imbursementComplete>();

export const imbursementsColumns = ({
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
  columnHelper.accessor("account.displayName", {
    header: "Creador",
    cell: (x) => <TextCell text={x.getValue()} />,
  }),
  columnHelper.accessor("amountInOtherCurrency", {
    header: "Monto Recibido",
    cell: (x) => (
      <MoneyCell
        amount={x.getValue()}
        currency={x.row.original.otherCurrency}
      />
    ),
  }),
  columnHelper.accessor("wasConvertedToOtherCurrency", {
    header: "Conversión",
    cell: (x) => <BooleanCell isActive={x.getValue()} />,
  }),
  columnHelper.accessor("finalAmount", {
    header: "Monto Final",
    cell: (x) =>
      x.row.original.wasConvertedToOtherCurrency ? (
        <MoneyCell
          amount={x.getValue()}
          currency={x.row.original.finalCurrency}
        />
      ) : (
        <MoneyCell
          amount={x.row.original.amountInOtherCurrency}
          currency={x.row.original.otherCurrency}
        />
      ),
  }),
  columnHelper.accessor("moneyAccount.displayName", {
    header: "Cuenta",
    cell: (x) => (
      <TextCell
        text={x.row.original.moneyAccount?.displayName ? x.getValue() : "ERROR"}
      />
    ),
  }),
  columnHelper.display({
    cell: (x) => (
      <ImageModalCell
        imageName={x.row.original.imbursementProof?.imageName}
        url={x.row.original.imbursementProof?.url}
      />
    ),
    header: "Comprobante desembolso",
  }),
  columnHelper.display({
    cell: (x) => (
      <ImageModalCell
        imageName={x.row.original.invoiceFromOrg?.imageName}
        url={x.row.original.invoiceFromOrg?.url}
      />
    ),
    header: "Factura",
  }),
  columnHelper.accessor("taxPayer.razonSocial", {
    cell: (x) => <TextCell text={x.getValue()} />,
    header: "Contribuyente",
  }),
  columnHelper.display({
    cell: (x) => <TextCell text={x.row.original.project?.displayName ?? "-"} />,
    header: "Proyecto",
  }),
];
