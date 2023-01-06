import type { Account } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';
import BooleanCell from '../../../components/DynamicTables/DynamicCells/BooleanCell';
import DateCell from '../../../components/DynamicTables/DynamicCells/DateCell';
import TextCell from '../../../components/DynamicTables/DynamicCells/TextCell';
import type { FormAccount } from '../../../lib/validations/account.validate';
import RowOptionsModUsers from './rowOptions.mod.users';

const columnHelper = createColumnHelper<Account>();

export const modUsersColumns = ({
  pageIndex,
  pageSize,
  onEditOpen,
  setEditAccount,
}: {
  pageSize: number;
  pageIndex: number;
  onEditOpen: () => void;
  setEditAccount: React.Dispatch<React.SetStateAction<FormAccount | null>>;
}) => [
  columnHelper.display({
    cell: (x) => x.row.index + 1 + pageIndex * pageSize,
    header: 'N.',
  }),
  columnHelper.accessor('active', {
    header: 'Activo',
    cell: (x) => <BooleanCell isActive={x.getValue()} />,
  }),
  columnHelper.accessor('createdAt', {
    cell: (x) => <DateCell date={x.getValue()} />,
    header: 'Fecha de C.',
    sortingFn: 'datetime',
  }),
  columnHelper.accessor('displayName', {
    header: 'Nombre',
    cell: (x) => <TextCell text={x.getValue()} />,
  }),
  columnHelper.accessor('email', {
    header: 'Correo',
    cell: (x) => <TextCell text={x.getValue()} />,
  }),
  columnHelper.accessor('role', {
    header: 'Rol',
    cell: (x) => <TextCell text={x.getValue()} />,
  }),
  columnHelper.accessor('isVerified', {
    header: 'Verificado',
    cell: (x) => <BooleanCell isActive={x.getValue()} />,
  }),
  columnHelper.display({
    header: 'Opciones',
    cell: (x) => {
      return (
        <RowOptionsModUsers
          x={x.row.original}
          onEditOpen={onEditOpen}
          setEditAccount={setEditAccount}
        />
      );
    },
  }),
];
