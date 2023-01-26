import { createColumnHelper } from '@tanstack/react-table';
import DateCell from '@/components/DynamicTables/DynamicCells/DateCell';
import TextCell from '@/components/DynamicTables/DynamicCells/TextCell';
import RowOptionsHomeTaxPayers from './rowOptions.mod.taxpayers';
import type { FormTaxPayer } from '@/lib/validations/taxtPayer.validate';

const columnHelper = createColumnHelper<FormTaxPayer>();

export const taxpayersColumns = ({
  onEditOpen,
  setEditTaxPayer,
  pageIndex,
  pageSize,
}: {
  onEditOpen: () => void;
  setEditTaxPayer: React.Dispatch<React.SetStateAction<FormTaxPayer | null>>;
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
  columnHelper.display({
    cell: (x) => (
      <TextCell
        text={
          x.row.original.fantasyName?.length ? x.row.original.fantasyName : '-'
        }
      />
    ),
    header: 'N. de Fantasía',
  }),
  columnHelper.accessor('razonSocial', {
    cell: (x) => <TextCell text={x.getValue()} />,
    header: 'Razón Social',
  }),
  columnHelper.accessor('ruc', {
    cell: (x) => <TextCell text={x.getValue()} />,
    header: 'R.U.C.',
  }),

  columnHelper.display({
    header: 'Opciones',
    cell: (x) => {
      return (
        <RowOptionsHomeTaxPayers
          x={x.row.original}
          onEditOpen={onEditOpen}
          setEditTaxPayer={setEditTaxPayer}
        />
      );
    },
  }),
];
