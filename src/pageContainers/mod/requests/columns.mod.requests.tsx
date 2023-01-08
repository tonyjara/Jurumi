import type { Account, MoneyRequest } from '@prisma/client';
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
import type { MoneyRequestComplete } from './MoneyRequestsPage.mod.requests';
import RowOptionsModRequests from './rowOptions.mod.requests';

const columnHelper = createColumnHelper<MoneyRequestComplete>();

export const moneyRequestsColumns = ({
  user,
  onEditOpen,
  setEditMoneyRequest,
  pageIndex,
  pageSize,
}: {
  user: Omit<Account, 'password'> | undefined;
  onEditOpen: () => void;
  setEditMoneyRequest: React.Dispatch<
    React.SetStateAction<MoneyRequest | null>
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
  columnHelper.display({
    cell: (x) => {
      const { needsApproval, approvalText, approverNames } = ApprovalUtils(
        x.getValue() as any,
        user
      );
      return (
        <TextCell
          text={needsApproval() ? approvalText : 'No req.'}
          hover={approverNames}
        />
      );
    },
    header: 'Aprobación',
  }),
  columnHelper.accessor('status', {
    header: 'Desembolso',
    cell: (x) => (
      <EnumTextCell
        text={x.getValue()}
        enumFunc={translatedMoneyReqStatus}
        hover={x.row.original.rejectionMessage}
      />
    ),
  }),
  columnHelper.accessor('moneyRequestType', {
    header: 'Tipo',
    cell: (x) => (
      <EnumTextCell text={x.getValue()} enumFunc={translatedMoneyReqType} />
    ),
  }),
  columnHelper.accessor('amountRequested', {
    header: 'Monto',
    cell: (x) => (
      <MoneyCell amount={x.getValue()} currency={x.row.original.currency} />
    ),
  }),
  columnHelper.accessor('account.displayName', {
    header: 'Creador',
    cell: (x) => <TextCell text={x.getValue()} />,
  }),
  columnHelper.display({
    header: 'Proyecto',
    cell: (x) => (
      <TextCell text={x.row.original?.project?.displayName ?? '-'} />
    ),
  }),
  columnHelper.display({
    header: 'L. Presu.',
    cell: (x) => (
      <TextCell text={x.row.original?.costCategory?.displayName ?? '-'} />
    ),
  }),
  columnHelper.accessor('description', {
    cell: (x) => (
      <TextCell text={x.getValue()} shortenString hover={x.getValue()} />
    ),
    header: 'Concepto',
  }),
  columnHelper.display({
    header: 'Ejecutado',
    cell: (x) => (
      <PercentageCell
        total={x.row.original.amountRequested}
        executed={reduceTransactionAmounts(x.row.original.transactions)}
        currency={x.row.original.currency}
      />
    ),
  }),
  columnHelper.display({
    header: 'Rendido',
    cell: (x) => (
      <PercentageCell
        total={x.row.original.amountRequested}
        executed={reduceExpenseReports(x.row.original.expenseReports)}
        currency={x.row.original.currency}
      />
    ),
  }),
  columnHelper.display({
    header: 'Opciones',
    cell: (x) => {
      const { needsApproval, hasBeenApproved } = ApprovalUtils(
        x.row.original as any,
        user
      );
      return (
        <RowOptionsModRequests
          needsApproval={needsApproval()}
          x={x.row.original}
          onEditOpen={onEditOpen}
          setEditMoneyRequest={setEditMoneyRequest}
          hasBeenApproved={hasBeenApproved()}
        />
      );
    },
  }),
];