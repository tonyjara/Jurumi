import { createColumnHelper } from '@tanstack/react-table';
import DateCell from '@/components/DynamicTables/DynamicCells/DateCell';
import FacturaNumberCell from '@/components/DynamicTables/DynamicCells/FacturaNumberCell';
import ImageModalCell from '@/components/DynamicTables/DynamicCells/ImageModalCell';
import MoneyCell from '@/components/DynamicTables/DynamicCells/MoneyCell';
import TextCell from '@/components/DynamicTables/DynamicCells/TextCell';
import type { MyExpenseReport } from './ExpenseReportsPage.home.expense-reports';
import RowOptionsHomeExpenseReports from './rowOptions.home.expense-reports';

const columnHelper = createColumnHelper<MyExpenseReport>();

export const expenseReportColums = ({
  onEditOpen,
  setEditExpenseReport,
  pageIndex,
  pageSize,
}: {
  onEditOpen: () => void;
  setEditExpenseReport: React.Dispatch<
    React.SetStateAction<MyExpenseReport | null>
  >;
  pageSize: number;
  pageIndex: number;
}) => [
  columnHelper.display({
    cell: (x) => x.row.index + 1 + pageIndex * pageSize,
    header: 'N.',
  }),
  columnHelper.accessor('createdAt', {
    cell: (x) => <DateCell date={x.getValue()} />,
    header: 'Fecha de C.',
    sortingFn: 'datetime',
  }),
  columnHelper.accessor('facturaNumber', {
    cell: (x) => <FacturaNumberCell text={x.getValue()} />,
    header: 'Factura N.',
  }),
  columnHelper.accessor('comments', {
    cell: (x) => (
      <TextCell
        shortenString
        hover={x.getValue()}
        text={x.getValue().length ? x.getValue() : '-'}
      />
    ),
    header: 'Comentarios',
  }),
  columnHelper.accessor('amountSpent', {
    cell: (x) => (
      <MoneyCell amount={x.getValue()} currency={x.row.original.currency} />
    ),
    header: 'Monto',
  }),
  columnHelper.display({
    cell: (x) => (
      <ImageModalCell
        imageName={x.row.original.searchableImage?.imageName}
        url={x.row.original.searchableImage?.url}
      />
    ),
    header: 'Comprobante',
  }),

  columnHelper.accessor('taxPayer.razonSocial', {
    cell: (x) => <TextCell text={x.getValue()} />,
    header: 'Contribuyente',
  }),
  columnHelper.display({
    cell: (x) => <TextCell text={x.row.original.Project?.displayName ?? '-'} />,
    header: 'Proyecto',
  }),
  columnHelper.display({
    cell: (x) => (
      <TextCell text={x.row.original.CostCategory?.displayName ?? '-'} />
    ),
    header: 'L. Presup.',
  }),
  columnHelper.display({
    header: 'Opciones',
    cell: (x) => {
      return (
        <RowOptionsHomeExpenseReports
          x={x.row.original}
          onEditOpen={onEditOpen}
          setEditExpenseReport={setEditExpenseReport}
        />
      );
    },
  }),
];
