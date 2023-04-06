import { createColumnHelper } from '@tanstack/react-table';
import { addHours, isBefore } from 'date-fns';
import BooleanCell from '@/components/DynamicTables/DynamicCells/BooleanCell';
import TextCell from '@/components/DynamicTables/DynamicCells/TextCell';
import CopyLinkCellButton from '@/components/DynamicTables/usersPage/CopyLink.cellButton';
import RowOptionsVerificationLinks from './rowOptions.mod.users.verification-links';
import type { VerificationLinksWithAccountName } from './VerifyLinksPage.mod.users';
import type { Account } from '@prisma/client';

const columnHelper = createColumnHelper<VerificationLinksWithAccountName>();

export const verificationLinksColumns = ({
  pageIndex,
  pageSize,
  user,
}: {
  pageSize: number;
  pageIndex: number;
  user:
    | (Omit<Account, 'password'> & {
        profile: {
          avatarUrl: string;
        } | null;
      })
    | undefined;
}) => [
  columnHelper.display({
    cell: (x) => x.row.index + 1 + pageIndex * pageSize,
    header: 'N.',
  }),
  columnHelper.accessor('email', {
    header: 'Correo',
    cell: (x) => <TextCell text={x.getValue()} />,
  }),
  columnHelper.display({
    header: 'Disponible',
    cell: (x) => {
      const isActive =
        isBefore(new Date(), addHours(x.row.original.createdAt, 1)) &&
        !x.row.original.hasBeenUsed;
      return <BooleanCell isActive={isActive} />;
    },
  }),
  columnHelper.accessor('hasBeenUsed', {
    header: 'Activado',
    cell: (x) => <BooleanCell isActive={x.getValue()} />,
  }),
  columnHelper.display({
    header: 'Link',
    cell: (x) => {
      const isActive =
        isBefore(new Date(), addHours(x.row.original.createdAt, 1)) &&
        !x.row.original.hasBeenUsed;
      return isActive ? (
        <CopyLinkCellButton
          disabled={!(user?.role === 'ADMIN' || user?.role === 'MODERATOR')}
          link={x.row.original.verificationLink}
        />
      ) : (
        <></>
      );
    },
  }),
  columnHelper.display({
    header: 'Opciones',
    cell: (x) => {
      return <RowOptionsVerificationLinks user={user} x={x.row.original} />;
    },
  }),
];
