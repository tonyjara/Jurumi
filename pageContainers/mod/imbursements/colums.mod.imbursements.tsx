import type { Account, Imbursement, MoneyRequest } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';

import DateCell from '@/components/DynamicTables/DynamicCells/DateCell';
import EnumTextCell from '@/components/DynamicTables/DynamicCells/EnumTextCell';
import MoneyCell from '@/components/DynamicTables/DynamicCells/MoneyCell';
import PercentageCell from '@/components/DynamicTables/DynamicCells/PercentageCell';
import TextCell from '@/components/DynamicTables/DynamicCells/TextCell';
import { ApprovalUtils } from '@/lib/utils/ApprovalUtilts';
import {
  reduceExpenseReports,
  reduceTransactionAmounts,
} from '@/lib/utils/TransactionUtils';
import {
  translatedMoneyReqStatus,
  translatedMoneyReqType,
} from '@/lib/utils/TranslatedEnums';
import type { imbursementComplete } from './ImbursementsPage.mod.imbursements';

const columnHelper = createColumnHelper<imbursementComplete>();

export const imbursementsColumns = ({
  onEditOpen,
  setEditImbursement,
  pageIndex,
  pageSize,
}: {
  // user: Omit<Account, 'password'> | undefined;
  onEditOpen: () => void;
  setEditImbursement: React.Dispatch<React.SetStateAction<Imbursement | null>>;
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
  // columnHelper.accessor('account.displayName', {
  //   header: 'Creador',
  //   cell: (x) => <TextCell text={x.getValue()} />,
  // }),

  // columnHelper.display({
  //   header: 'Opciones',
  //   cell: (x) => {

  //     return (
  //       <RowOptionsModRequests
  //         needsApproval={needsApproval()}
  //         x={x.row.original}
  //         onEditOpen={onEditOpen}
  //         setEditMoneyRequest={setEditMoneyRequest}
  //         hasBeenApproved={hasBeenApproved()}
  //       />
  //     );
  //   },
  // }),
];
