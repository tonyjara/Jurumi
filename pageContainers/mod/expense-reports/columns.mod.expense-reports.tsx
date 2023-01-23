import { createColumnHelper } from '@tanstack/react-table';
import DateCell from '@/components/DynamicTables/DynamicCells/DateCell';
import FacturaNumberCell from '@/components/DynamicTables/DynamicCells/FacturaNumberCell';
import ImageModalCell from '@/components/DynamicTables/DynamicCells/ImageModalCell';
import MoneyCell from '@/components/DynamicTables/DynamicCells/MoneyCell';
import TextCell from '@/components/DynamicTables/DynamicCells/TextCell';
import RowOptionsHomeExpenseReports from './rowOptions.mod.expense-reports';
import type { ExpenseReportComplete } from './ModExpenseReportsPage.mod.expense-reports';

const columnHelper = createColumnHelper<ExpenseReportComplete>();

export const modExpenseReportsColumns = ({
  onEditOpen,
  setEditExpenseReport,
  pageIndex,
  pageSize,
}: {
  onEditOpen: () => void;
  setEditExpenseReport: React.Dispatch<
    React.SetStateAction<ExpenseReportComplete | null>
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
  columnHelper.accessor('account.displayName', {
    header: 'Creador',
    cell: (x) => <TextCell text={x.getValue()} />,
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
    cell: (x) => <TextCell text={x.row.original.project?.displayName ?? '-'} />,
    header: 'Proyecto',
  }),
  // columnHelper.display({
  //   cell: (x) => (
  //     <TextCell text={x.row.original.costCategory?.displayName ?? '-'} />
  //   ),
  //   header: 'L. Presup.',
  // }),
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
