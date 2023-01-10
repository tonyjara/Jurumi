import { useDisclosure } from '@chakra-ui/react';
import type { ExpenseReport } from '@prisma/client';
import React, { useEffect, useState } from 'react';

import type { TableOptions } from '../../../components/DynamicTables/DynamicTable';
import DynamicTable from '../../../components/DynamicTables/DynamicTable';
import { useDynamicTable } from '../../../components/DynamicTables/UseDynamicTable';
import TableSearchbar from '../../../components/DynamicTables/Utils/TableSearchbar';
import EditExpenseReportModal from '../../../components/Modals/expenseReport.edit.modal';
import { trpcClient } from '../../../lib/utils/trpcClient';
import { expenseReportColums } from './columns.expense-reports';

export type MyExpenseReport = ExpenseReport & {
  searchableImage: {
    url: string;
    imageName: string;
  } | null;
  Project: {
    id: string;
    displayName: string;
  } | null;
  CostCategory: {
    id: string;
    displayName: string;
  } | null;
  taxPayer: {
    razonSocial: string;
    fantasyName: string | null;
    ruc: string;
  };
};

const MyExpenseReportsPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [editExpenseReport, setEditExpenseReport] =
    useState<MyExpenseReport | null>(null);
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, setGlobalFilter, globalFilter, pageSize, sorting } =
    dynamicTableProps;

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  useEffect(() => {
    if (!isEditOpen && editExpenseReport) {
      setEditExpenseReport(null);
    }
    return () => {};
  }, [editExpenseReport, isEditOpen]);

  const { data: expenseReports, isFetching } =
    trpcClient.expenseReport.getManyComplete.useQuery(
      { pageIndex, pageSize, sorting: globalFilter ? sorting : null },
      { keepPreviousData: globalFilter ? true : false }
    );
  const { data: count } = trpcClient.expenseReport.count.useQuery();

  const handleDataSource = () => {
    if (!expenseReports) return [];
    // if (findByIdData) return [findByIdData];
    if (expenseReports) return expenseReports;
    return [];
  };

  const tableOptions: TableOptions[] = [
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
        title={'Mis Rendiciones'}
        searchBar={
          <TableSearchbar
            type="text"
            placeholder="Buscar por ID"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        }
        options={tableOptions}
        loading={isFetching}
        columns={expenseReportColums({
          onEditOpen,
          setEditExpenseReport,
          pageIndex,
          pageSize,
        })}
        data={handleDataSource()}
        count={count ?? 0}
        {...dynamicTableProps}
      />
      {editExpenseReport && (
        <EditExpenseReportModal
          expenseReport={editExpenseReport}
          isOpen={isEditOpen}
          onClose={onEditClose}
        />
      )}
    </>
  );
};

export default MyExpenseReportsPage;