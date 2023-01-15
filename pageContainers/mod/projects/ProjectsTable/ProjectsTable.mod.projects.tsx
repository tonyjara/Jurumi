import { useDisclosure } from '@chakra-ui/react';
import type {
  Account,
  CostCategory,
  Currency,
  Prisma,
  Project,
} from '@prisma/client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import type { TableOptions } from '@/components/DynamicTables/DynamicTable';
import DynamicTable from '@/components/DynamicTables/DynamicTable';
import { useDynamicTable } from '@/components/DynamicTables/UseDynamicTable';
import { trpcClient } from '@/lib/utils/trpcClient';
import EditProjectModal from '@/components/Modals/project.edit.modal';
import { projectsColumn } from './columns.mod.projects';

export type ProjectForTable = Project & {
  _count: {
    allowedUsers: number;
  };
  costCategories: (CostCategory & {
    transactions: {
      currency: Currency;
      openingBalance: Prisma.Decimal;
      currentBalance: Prisma.Decimal;
      transactionAmount: Prisma.Decimal;
    }[];
    project: {
      id: string;
      displayName: string;
    } | null;
  })[];
};

const ProjectsTable = () => {
  const session = useSession();
  const user = session.data?.user;
  const [editProject, setEditProject] = useState<ProjectForTable | null>(null);
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, setGlobalFilter, globalFilter, pageSize, sorting } =
    dynamicTableProps;

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  useEffect(() => {
    if (!isEditOpen && editProject) {
      setEditProject(null);
    }
    return () => {};
  }, [editProject, isEditOpen]);

  const { data: count } = trpcClient.project.count.useQuery();

  const {
    data: projects,
    isLoading,
    isFetching,
  } = trpcClient.project.getManyForTable.useQuery(
    { pageIndex, pageSize, sorting: globalFilter ? sorting : null },
    { keepPreviousData: globalFilter ? true : false }
  );

  const handleDataSource = () => {
    if (!projects) return [];
    return projects;
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

  console.log(projects);

  return (
    <>
      <DynamicTable
        title={'Solicitudes'}
        columns={projectsColumn({
          onEditOpen,
          setEditProject,
          pageIndex,
          pageSize,
        })}
        loading={isFetching || isLoading}
        options={tableOptions}
        data={handleDataSource() ?? []}
        count={count ?? 0}
        {...dynamicTableProps}
      />

      {editProject && (
        <EditProjectModal
          project={editProject}
          isOpen={isEditOpen}
          onClose={onEditClose}
        />
      )}
    </>
  );
};

export default ProjectsTable;
