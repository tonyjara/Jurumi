import { useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import type { TableOptions } from '@/components/DynamicTables/DynamicTable';
import DynamicTable from '@/components/DynamicTables/DynamicTable';
import { useDynamicTable } from '@/components/DynamicTables/UseDynamicTable';
import CreateAccountModal from '@/components/Modals/account.create.modal';
import EditAccountModal from '@/components/Modals/account.edit.modal';
import { trpcClient } from '@/lib/utils/trpcClient';
import type { FormAccount } from '@/lib/validations/account.validate';
import { membersListPageColumns } from './columns.membersList.mod.members';
import CreateMemberModal from '@/components/Modals/member.create.modal';

const MembersListPage = () => {
  const [editAccount, setEditAccount] = useState<FormAccount | null>(null);
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, setGlobalFilter, globalFilter, pageSize, sorting } =
    dynamicTableProps;

  const { data, isFetching, isLoading } = trpcClient.account.getMany.useQuery(
    { pageIndex, pageSize, sorting: globalFilter ? sorting : null },
    { keepPreviousData: globalFilter ? true : false }
  );
  const { data: count } = trpcClient.account.count.useQuery();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  useEffect(() => {
    if (!isEditOpen && editAccount) {
      setEditAccount(null);
    }
    return () => {};
  }, [editAccount, isEditOpen]);

  const options: TableOptions[] = [
    {
      onClick: onOpen,
      label: 'Crear socio',
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
        title={'Socios'}
        options={options}
        columns={membersListPageColumns({
          pageIndex,
          pageSize,
          onEditOpen,
          setEditAccount,
        })}
        loading={isFetching || isLoading}
        data={data ?? []}
        count={count ?? 0}
        {...dynamicTableProps}
      />
      <CreateMemberModal isOpen={isOpen} onClose={onClose} />
      {editAccount && (
        <EditAccountModal
          account={editAccount}
          isOpen={isEditOpen}
          onClose={onEditClose}
        />
      )}
    </>
  );
};

export default MembersListPage;
