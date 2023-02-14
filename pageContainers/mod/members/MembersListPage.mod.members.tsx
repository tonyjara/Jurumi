import { useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import type { TableOptions } from '@/components/DynamicTables/DynamicTable';
import DynamicTable from '@/components/DynamicTables/DynamicTable';
import { useDynamicTable } from '@/components/DynamicTables/UseDynamicTable';
import { trpcClient } from '@/lib/utils/trpcClient';
import { membersListPageColumns } from './columns.membersList.mod.members';
import CreateMemberModal from '@/components/Modals/member.create.modal';
import type { Account, Membership } from '@prisma/client';

export type CompleteMember = Membership & {
  account: Account;
};

const MembersListPage = () => {
  const [editMember, setEditMember] = useState<CompleteMember | null>(null);
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, setGlobalFilter, globalFilter, pageSize, sorting } =
    dynamicTableProps;

  const { data, isFetching, isLoading } = trpcClient.members.getMany.useQuery(
    { pageIndex, pageSize, sorting: globalFilter ? sorting : null },
    { keepPreviousData: globalFilter ? true : false }
  );
  const { data: count } = trpcClient.members.count.useQuery();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  useEffect(() => {
    if (!isEditOpen && editMember) {
      setEditMember(null);
    }
    return () => {};
  }, [editMember, isEditOpen]);

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
          setEditMember,
        })}
        loading={isFetching || isLoading}
        data={data ?? []}
        count={count ?? 0}
        {...dynamicTableProps}
      />
      <CreateMemberModal isOpen={isOpen} onClose={onClose} />
      {/* {editMember && (
        <EditAccountModal
          account={editMember}
          isOpen={isEditOpen}
          onClose={onEditClose}
        />
      )} */}
    </>
  );
};

export default MembersListPage;
