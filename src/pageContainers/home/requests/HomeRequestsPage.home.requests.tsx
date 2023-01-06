import { useDisclosure } from '@chakra-ui/react';
import type {
  CostCategory,
  ExpenseReport,
  MoneyRequest,
  Project,
  Transaction,
} from '@prisma/client';
import React, { useEffect, useState } from 'react';
import type { TableOptions } from '../../../components/DynamicTables/DynamicTable';
import DynamicTable from '../../../components/DynamicTables/DynamicTable';
import { useDynamicTable } from '../../../components/DynamicTables/UseDynamicTable';
import CreateExpenseReportModal from '../../../components/Modals/ExpenseReport.create.modal';
import EditMoneyRequestModal from '../../../components/Modals/MoneyReq.edit.modal';
import CreateMoneyRequestModal from '../../../components/Modals/MoneyRequest.create.modal';
import { trpcClient } from '../../../lib/utils/trpcClient';
import { homeRequestsColumns } from './columns.home.requests';

export type CompleteMoneyReqHome = MoneyRequest & {
  transactions: Transaction[];
  expenseReports: ExpenseReport[];
  project: Project | null;
  costCategory: CostCategory | null;
};

const MoneyRequestsPage = () => {
  const [editMoneyRequest, setEditMoneyRequest] = useState<MoneyRequest | null>(
    null
  );
  const [reqForReport, setReqForReport] = useState<CompleteMoneyReqHome | null>(
    null
  );
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, setGlobalFilter, globalFilter, pageSize, sorting } =
    dynamicTableProps;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isExpRepOpen,
    onOpen: onExpRepOpen,
    onClose: onExpRepClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  useEffect(() => {
    if (!isEditOpen && editMoneyRequest) {
      setEditMoneyRequest(null);
    }
    return () => {};
  }, [editMoneyRequest, isEditOpen]);
  useEffect(() => {
    if (!isExpRepOpen && reqForReport) {
      setReqForReport(null);
    }
    return () => {};
  }, [reqForReport, isExpRepOpen]);

  const { data: moneyRequests, isFetching } =
    trpcClient.moneyRequest.getMyOwnComplete.useQuery(
      { pageIndex, pageSize, sorting: globalFilter ? sorting : null },
      { keepPreviousData: globalFilter ? true : false }
    );
  const { data: count } = trpcClient.moneyRequest.countMyOwn.useQuery();

  const handleDataSource = () => {
    if (moneyRequests) return moneyRequests;
    return [];
  };

  const tableOptions: TableOptions[] = [
    {
      onClick: onOpen,
      label: 'Crear solicitud',
    },
    {
      onClick: () => setGlobalFilter(true),
      label: `${globalFilter ? '✅' : '❌'} Filtro global`,
    },
    {
      onClick: () => setGlobalFilter(false),
      label: `${!globalFilter ? '✅' : '❌'} Filtro local`,
    },
  ];

  return (
    <>
      <DynamicTable
        title={'Mis Solicitudes'}
        loading={isFetching}
        options={tableOptions}
        columns={homeRequestsColumns({
          onEditOpen,
          setEditMoneyRequest,
          pageIndex,
          pageSize,
          setReqForReport,
          onExpRepOpen,
        })}
        data={handleDataSource()}
        count={count ?? 0}
        {...dynamicTableProps}
      />

      <CreateMoneyRequestModal orgId={null} isOpen={isOpen} onClose={onClose} />
      {reqForReport && (
        <CreateExpenseReportModal
          moneyRequest={reqForReport}
          isOpen={isExpRepOpen}
          onClose={onExpRepClose}
        />
      )}
      {editMoneyRequest && (
        <EditMoneyRequestModal
          moneyRequest={editMoneyRequest}
          isOpen={isEditOpen}
          onClose={onEditClose}
        />
      )}
    </>
  );
};

export default MoneyRequestsPage;
