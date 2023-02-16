import { useDisclosure } from '@chakra-ui/react';
import type {
  Account,
  CostCategory,
  ExpenseReport,
  ExpenseReturn,
  MoneyRequest,
  MoneyRequestApproval,
  Project,
  searchableImage,
  TaxPayerBankInfo,
  Transaction,
} from '@prisma/client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import type { TableOptions } from '@/components/DynamicTables/DynamicTable';
import DynamicTable from '@/components/DynamicTables/DynamicTable';
import { useDynamicTable } from '@/components/DynamicTables/UseDynamicTable';
import TableSearchbar from '@/components/DynamicTables/Utils/TableSearchbar';
import EditMoneyRequestModal from '@/components/Modals/MoneyReq.edit.modal';
import CreateMoneyRequestModal from '@/components/Modals/MoneyRequest.create.modal';
import { trpcClient } from '@/lib/utils/trpcClient';
import type { MoneyRequestsPageProps } from 'pages/mod/requests';
import { moneyRequestsColumns } from './columns.mod.requests';
import CreateExpenseReportModal from '@/components/Modals/ExpenseReport.create.modal';
import CreateExpenseReturnModal from '@/components/Modals/ExpenseReturn.create.modal';

export type MoneyRequestComplete = MoneyRequest & {
  project: Project | null;
  transactions: Transaction[];
  searchableImage: searchableImage | null;
  expenseReports: (ExpenseReport & {
    taxPayer: {
      id: string;
      razonSocial: string;
    };
  })[];
  expenseReturns: ExpenseReturn[];
  account: Account;
  costCategory: CostCategory | null;
  taxPayer: {
    id: string;
    razonSocial: string;
    ruc: string;
    bankInfo: TaxPayerBankInfo | null;
  } | null;
  moneyRequestApprovals: MoneyRequestApproval[];
  organization: {
    moneyRequestApprovers: {
      id: string;
      displayName: string;
    }[];
    moneyAdministrators: {
      id: string;
      displayName: string;
    }[];
  };
};

const ModMoneyRequestsPage = ({ query }: { query: MoneyRequestsPageProps }) => {
  const session = useSession();
  const user = session.data?.user;
  const [searchValue, setSearchValue] = useState('');
  const [editMoneyRequest, setEditMoneyRequest] = useState<MoneyRequest | null>(
    null
  );
  const [reqForReport, setReqForReport] = useState<MoneyRequestComplete | null>(
    null
  );
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, setGlobalFilter, globalFilter, pageSize, sorting } =
    dynamicTableProps;

  useEffect(() => {
    if (query.moneyRequestId) {
      setSearchValue(query.moneyRequestId);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isExpRepOpen,
    onOpen: onExpRepOpen,
    onClose: onExpRepClose,
  } = useDisclosure();
  const {
    isOpen: isExpenseReturnOpen,
    onOpen: onExpenseReturnOpen,
    onClose: onExpenseReturnClose,
  } = useDisclosure();

  useEffect(() => {
    if (!isEditOpen && editMoneyRequest) {
      setEditMoneyRequest(null);
    }
    return () => {};
  }, [editMoneyRequest, isEditOpen]);

  const { data: prefs } = trpcClient.preferences.getMyPreferences.useQuery();
  const { data: count } = trpcClient.moneyRequest.count.useQuery();

  const { data: moneyRequests, isLoading } =
    trpcClient.moneyRequest.getManyComplete.useQuery(
      { pageIndex, pageSize, sorting: globalFilter ? sorting : null },
      { keepPreviousData: globalFilter ? true : false }
    );

  const { data: findByIdData, isFetching } =
    trpcClient.moneyRequest.findCompleteById.useQuery(
      { id: searchValue },
      { enabled: searchValue.length > 0 }
    );

  const handleDataSource = () => {
    if (!moneyRequests) return [];
    if (findByIdData) return [findByIdData];
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
        title={'Solicitudes'}
        searchBar={
          <TableSearchbar
            type="text"
            placeholder="Buscar por ID"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        }
        columns={moneyRequestsColumns({
          user,
          onEditOpen,
          setEditMoneyRequest,
          pageIndex,
          pageSize,
          setReqForReport,
          onExpRepOpen,
          onExpReturnOpen: onExpenseReturnOpen,
        })}
        loading={isFetching || isLoading}
        options={tableOptions}
        data={handleDataSource() ?? []}
        count={count ?? 0}
        colorRedKey={['wasCancelled']}
        {...dynamicTableProps}
      />
      {prefs?.selectedOrganization && (
        <CreateMoneyRequestModal
          orgId={prefs.selectedOrganization}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
      {reqForReport && (
        <CreateExpenseReportModal
          moneyRequest={reqForReport}
          isOpen={isExpRepOpen}
          onClose={onExpRepClose}
        />
      )}
      {reqForReport && (
        <CreateExpenseReturnModal
          moneyRequest={reqForReport}
          isOpen={isExpenseReturnOpen}
          onClose={onExpenseReturnClose}
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

export default ModMoneyRequestsPage;
