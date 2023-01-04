import { Tr, useDisclosure } from '@chakra-ui/react';
import type { ExpenseReport } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import DateCell from '../../../components/DynamicTables/DynamicCells/DateCell';
import FacturaNumberCell from '../../../components/DynamicTables/DynamicCells/FacturaNumberCell';
import ImageModalCell from '../../../components/DynamicTables/DynamicCells/ImageModalCell';
import MoneyCell from '../../../components/DynamicTables/DynamicCells/MoneyCell';
import TextCell from '../../../components/DynamicTables/DynamicCells/TextCell';
import DynamicTable from '../../../components/DynamicTables/DynamicTable';
import TableSearchbar from '../../../components/DynamicTables/Utils/TableSearchbar';
import EditExpenseReportModal from '../../../components/Modals/expenseReport.edit.modal';
import { trpcClient } from '../../../lib/utils/trpcClient';
import RowOptionsHomeExpenseReports from './rowOptions.home.expense-reports';

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
    trpcClient.expenseReport.getManyComplete.useQuery();

  const handleDataSource = () => {
    if (!expenseReports) return [];
    // if (findByIdData) return [findByIdData];
    if (expenseReports) return expenseReports;
    return [];
  };

  const rowHandler = handleDataSource().map((x) => {
    return (
      <Tr key={x.id}>
        <DateCell date={x.createdAt} />
        <FacturaNumberCell text={x.facturaNumber} />
        <TextCell shortenString hover={x.comments} text={x.comments} />
        <MoneyCell objectKey={'amountSpent'} data={x} />
        <ImageModalCell
          imageName={x.searchableImage?.imageName}
          url={x.searchableImage?.url}
        />
        <TextCell text={x.taxPayer.razonSocial} />
        <TextCell text={x.Project?.displayName ?? '-'} />
        <TextCell text={x.CostCategory?.displayName ?? '-'} />
        <RowOptionsHomeExpenseReports
          setEditExpenseReport={setEditExpenseReport}
          onEditOpen={onEditOpen}
          x={x}
        />
      </Tr>
    );
  });

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
        loading={isFetching}
        headers={[
          'F. Creacion',
          'Factura N.',
          'Comentarios',
          'Monto',
          'Comprobante',
          'Contribuyente',
          'Proyecto',
          'L. Presupuestaria',
          'Opciones',
        ]}
        rows={rowHandler}
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
