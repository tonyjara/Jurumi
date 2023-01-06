import type { Transaction } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';
import DateCell from '../../components/DynamicTables/DynamicCells/DateCell';
import MoneyCell from '../../components/DynamicTables/DynamicCells/MoneyCell';
import TextCell from '../../components/DynamicTables/DynamicCells/TextCell';
import RowOptionsModTransactions from './rowOptions.mod.transactions';
import type { TransactionComplete } from './TransactionsPage.mod.transactions';

const columnHelper = createColumnHelper<TransactionComplete>();

export const modTransactionsColumns = ({
  onEditOpen,
  setEditTransaction,
  pageIndex,
  pageSize,
}: {
  onEditOpen: () => void;
  setEditTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>;
  pageSize: number;
  pageIndex: number;
}) => [
  columnHelper.display({
    cell: (x) => x.row.index + 1 + pageIndex * pageSize,
    header: 'N.',
  }),
  columnHelper.accessor('id', {
    cell: (x) => <TextCell text={x.getValue().toString()} />,
    header: 'ID.',
  }),
  columnHelper.accessor('createdAt', {
    cell: (x) => <DateCell date={x.getValue()} />,
    header: 'Fecha de C.',
    sortingFn: 'datetime',
  }),
  columnHelper.accessor('moneyRequest.description', {
    cell: (x) => (
      <TextCell text={x.getValue()} shortenString hover={x.getValue()} />
    ),
    header: 'Concepto',
  }),
  columnHelper.accessor('transactionAmount', {
    header: 'Monto',
    cell: (x) => (
      <MoneyCell amount={x.getValue()} currency={x.row.original.currency} />
    ),
  }),
  columnHelper.accessor('account.displayName', {
    header: 'Creador',
    cell: (x) => <TextCell text={x.getValue()} />,
  }),
  columnHelper.accessor('moneyAccount.displayName', {
    header: 'Cuenta',
    cell: (x) => <TextCell text={x.getValue()} />,
  }),
  columnHelper.display({
    header: 'Opciones',
    cell: (x) => (
      <RowOptionsModTransactions
        x={x.row.original}
        setEditTransaction={setEditTransaction}
        onEditOpen={onEditOpen}
      />
    ),
  }),
];
