import { useDisclosure } from '@chakra-ui/react';
import type {
  Account,
  CostCategory,
  ExpenseReport,
  MoneyRequest,
  Project,
  Transaction,
} from '@prisma/client';
import type { SortingState } from '@tanstack/react-table';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import type { TableOptions } from '../../components/DynamicTables/DynamicTable';
import DynamicTable from '../../components/DynamicTables/DynamicTable';
import TableSearchbar from '../../components/DynamicTables/Utils/TableSearchbar';
import EditMoneyRequestModal from '../../components/Modals/MoneyReq.edit.modal';
import CreateMoneyRequestModal from '../../components/Modals/MoneyRequest.create.modal';
import { trpcClient } from '../../lib/utils/trpcClient';
import type { MoneyRequestsPageProps } from '../../pages/mod/requests';
import { moneyRequestsColumns } from './columns.mod.requests';

export type MoneyRequestComplete = MoneyRequest & {
  account: Account;
  project: Project | null;
  transactions: Transaction[];
  costCategory: CostCategory | null;
  expenseReports: ExpenseReport[];
};

const MoneyRequestsPage = ({ query }: { query: MoneyRequestsPageProps }) => {
  const session = useSession();
  const user = session.data?.user;
  const [searchValue, setSearchValue] = useState('');
  const [editMoneyRequest, setEditMoneyRequest] = useState<MoneyRequest | null>(
    null
  );
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState(false);

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

  useEffect(() => {
    if (!isEditOpen && editMoneyRequest) {
      setEditMoneyRequest(null);
    }
    return () => {};
  }, [editMoneyRequest, isEditOpen]);

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
        })}
        loading={isFetching || isLoading}
        options={tableOptions}
        data={handleDataSource() ?? []}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        pageSize={pageSize}
        setPageSize={setPageSize}
        count={count ?? 0}
        sorting={sorting}
        setSorting={setSorting}
        globalFilter={globalFilter}
      />
      <CreateMoneyRequestModal orgId={null} isOpen={isOpen} onClose={onClose} />
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
