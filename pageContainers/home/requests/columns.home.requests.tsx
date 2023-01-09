import type { MoneyRequest } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';
import DateCell from '../../../components/DynamicTables/DynamicCells/DateCell';
import EnumTextCell from '../../../components/DynamicTables/DynamicCells/EnumTextCell';
import MoneyCell from '../../../components/DynamicTables/DynamicCells/MoneyCell';
import PercentageCell from '../../../components/DynamicTables/DynamicCells/PercentageCell';
import TextCell from '../../../components/DynamicTables/DynamicCells/TextCell';
import { reduceExpenseReports } from '../../../lib/utils/TransactionUtils';
import {
  translatedMoneyReqStatus,
  translatedMoneyReqType,
} from '../../../lib/utils/TranslatedEnums';
import type { CompleteMoneyReqHome } from './HomeRequestsPage.home.requests';
import RowOptionsHomeRequests from './rowOptions.home.requests';

const columnHelper = createColumnHelper<CompleteMoneyReqHome>();

export const homeRequestsColumns = ({
  onEditOpen,
  setEditMoneyRequest,
  pageIndex,
  pageSize,
  setReqForReport,
  onExpRepOpen,
}: {
  onEditOpen: () => void;
  setEditMoneyRequest: React.Dispatch<
    React.SetStateAction<MoneyRequest | null>
  >;
  setReqForReport: React.Dispatch<
    React.SetStateAction<CompleteMoneyReqHome | null>
  >;
  pageSize: number;
  pageIndex: number;
  onExpRepOpen: () => void;
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
  //   columnHelper.display({
  //     cell: (x) => (
  //       <ImageModalCell
  //         imageName={x.row.original.searchableImage?.imageName}
  //         url={x.row.original.searchableImage?.url}
  //       />
  //     ),
  //     header: 'Comprobante',
  //   }),
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
  columnHelper.display({
    header: 'Proyecto',
    cell: (x) => (
      <TextCell text={x.row.original?.project?.displayName ?? '-'} />
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
      return (
        <RowOptionsHomeRequests
          x={x.row.original}
          onEditOpen={onEditOpen}
          setEditMoneyRequest={setEditMoneyRequest}
          setReqForReport={setReqForReport}
          onExpRepOpen={onExpRepOpen}
        />
      );
    },
  }),
];
