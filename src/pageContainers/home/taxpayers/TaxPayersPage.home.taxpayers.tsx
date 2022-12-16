import { Tr, useDisclosure } from '@chakra-ui/react';
import type {
  Account,
  MoneyRequest,
  Project,
  TaxPayer,
  Transaction,
} from '@prisma/client';
import { debounce } from 'lodash';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import DateCell from '../../../components/DynamicTables/DynamicCells/DateCell';
import TextCell from '../../../components/DynamicTables/DynamicCells/TextCell';
import type { TableOptions } from '../../../components/DynamicTables/DynamicTable';
import DynamicTable from '../../../components/DynamicTables/DynamicTable';
import TableSearchbar from '../../../components/DynamicTables/Utils/TableSearchbar';
import CreateTaxPayerModal from '../../../components/Modals/taxPayer.create.modal';
import EditTaxPayerModal from '../../../components/Modals/taxPayer.edit.modal';
import useDebounce from '../../../lib/hooks/useDebounce';
import { trpcClient } from '../../../lib/utils/trpcClient';
import RowOptionsHomeTaxPayers from './rowOptions.home.taxpayers';

export type MoneyRequestComplete = MoneyRequest & {
  account: Account;
  project: Project | null;
  transactions: Transaction[];
};

const TaxPayersPage = () => {
  const session = useSession();
  const user = session.data?.user;
  const [searchValue, setSearchValue] = useState('');
  const [editTaxPayer, setEditTaxPayer] = useState<TaxPayer | null>(null);
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const { data: taxPayers, isFetching: isFetchingTaxPayers } =
    trpcClient.taxPayer.getMany.useQuery();
  const { data: findByIdData, isFetching: isFetchingFindData } =
    trpcClient.taxPayer.findFullTextSearch.useQuery(
      { ruc: debouncedSearchValue },
      { enabled: debouncedSearchValue.length > 4 }
    );

  const handleDataSource = () => {
    if (!taxPayers) return [];
    if (findByIdData?.length) return findByIdData;
    return taxPayers;
  };

  const tableOptions: TableOptions[] = [
    {
      onClick: onOpen,
      label: 'Agregar contribuyente',
    },
  ];

  const rowHandler = handleDataSource().map((x) => {
    return (
      <Tr key={x.id}>
        <DateCell date={x.createdAt} />

        <TextCell text={x.fantasyName?.length ? x.fantasyName : '-'} />
        <TextCell text={x.razonSocial} />
        <TextCell text={x.ruc} />
        <RowOptionsHomeTaxPayers
          x={x}
          onEditOpen={onEditOpen}
          setEditTaxPayer={setEditTaxPayer}
        />
      </Tr>
    );
  });

  return (
    <>
      <DynamicTable
        title={'Contribuyentes'}
        searchBar={
          <TableSearchbar
            type="text"
            placeholder="Buscar por Ruc"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        }
        loading={isFetchingTaxPayers || isFetchingFindData}
        options={tableOptions}
        headers={[
          'F. Creacion',
          'N. de Fantasía',
          'Razón social',
          'R.U.C.',
          'Opciones',
        ]}
        rows={rowHandler}
      />
      <CreateTaxPayerModal isOpen={isOpen} onClose={onClose} />

      {editTaxPayer && (
        <EditTaxPayerModal
          taxPayer={editTaxPayer}
          isOpen={isEditOpen}
          onClose={onEditClose}
        />
      )}
    </>
  );
};

export default TaxPayersPage;
