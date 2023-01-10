import ImbursementCreateModal from '@/components/Modals/imbursement.create.modal';
import { useDisclosure } from '@chakra-ui/react';
import type { Imbursement } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import type { TableOptions } from '@/components/DynamicTables/DynamicTable';
import DynamicTable from '@/components/DynamicTables/DynamicTable';
import { useDynamicTable } from '@/components/DynamicTables/UseDynamicTable';
import { trpcClient } from '@/lib/utils/trpcClient';
import { imbursementsColumns } from './colums.mod.imbursements';

export type imbursementComplete = Imbursement & {
  transaction: {
    id: number;
  }[];
  taxPayer: {
    id: string;
    razonSocial: string;
    ruc: string;
  };
  project: {
    id: string;
    displayName: string;
  } | null;
  projectStage: {
    id: string;
    displayName: string;
  } | null;
  searchableImage: {
    imageName: string;
    url: string;
  } | null;
  moneyAccount: {
    displayName: string;
  } | null;
  account: {
    id: string;
    displayName: string;
  };
};

const ImbursementsPage = () => {
  const [editImbursement, setEditImbursement] = useState<Imbursement | null>(
    null
  );
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, setGlobalFilter, globalFilter, pageSize, sorting } =
    dynamicTableProps;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  useEffect(() => {
    if (!isEditOpen && editImbursement) {
      setEditImbursement(null);
    }
    return () => {};
  }, [editImbursement, isEditOpen]);

  const { data: imbursements, isFetching } =
    trpcClient.imbursement.getManyComplete.useQuery(
      { pageIndex, pageSize, sorting: globalFilter ? sorting : null },
      { keepPreviousData: globalFilter ? true : false }
    );
  const { data: count } = trpcClient.imbursement.count.useQuery();

  const handleDataSource = () => {
    if (imbursements) return imbursements;
    return [];
  };

  const tableOptions: TableOptions[] = [
    {
      onClick: onOpen,
      label: 'Crear desembolso',
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
        title={'Desembolsos'}
        loading={isFetching}
        options={tableOptions}
        columns={imbursementsColumns({
          onEditOpen,
          setEditImbursement,
          pageIndex,
          pageSize,
        })}
        data={handleDataSource()}
        count={count ?? 0}
        {...dynamicTableProps}
      />

      <ImbursementCreateModal isOpen={isOpen} onClose={onClose} />

      {/* {editMoneyRequest && (
        <EditMoneyRequestModal
          moneyRequest={editMoneyRequest}
          isOpen={isEditOpen}
          onClose={onEditClose}
        />
      )} */}
    </>
  );
};

export default ImbursementsPage;
