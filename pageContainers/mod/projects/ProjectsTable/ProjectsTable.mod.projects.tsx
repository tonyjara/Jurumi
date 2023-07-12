import { useDisclosure } from "@chakra-ui/react";
import type { CostCategory, Currency, Prisma, Project } from "@prisma/client";
import React, { useEffect, useState } from "react";
import type {
  RowOptionsType,
  TableOptions,
} from "@/components/DynamicTables/DynamicTable";
import DynamicTable from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import { trpcClient } from "@/lib/utils/trpcClient";
import EditProjectModal from "@/components/Modals/project.edit.modal";
import { projectsColumn } from "./columns.mod.projects";
import { myToast } from "@/components/Toasts & Alerts/MyToast";
import CreateProjectModal from "@/components/Modals/project.create.modal";
import RowOptionsModProjects from "./rowOptions.mod.projects";

export type ProjectForTable = Project & {
  costCategories: (CostCategory & {
    transactions: {
      openingBalance: Prisma.Decimal;
      currency: Currency;
      currentBalance: Prisma.Decimal;
      transactionAmount: Prisma.Decimal;
    }[];
  })[];
  _count: {
    allowedUsers: number;
  };
  transactions: {
    openingBalance: Prisma.Decimal;
    currency: Currency;
    currentBalance: Prisma.Decimal;
    transactionAmount: Prisma.Decimal;
  }[];
};

const ProjectsTable = () => {
  const [editProject, setEditProject] = useState<ProjectForTable | null>(null);
  const dynamicTableProps = useDynamicTable();
  const { setGlobalFilter, globalFilter, sorting } = dynamicTableProps;

  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const {
    data: projects,
    isLoading,
    isFetching,
  } = trpcClient.project.getManyForTable.useQuery(
    { sorting: globalFilter ? sorting : null },
    { keepPreviousData: globalFilter ? true : false }
  );
  trpcClient.project.getManyForTable.useQuery({});
  const { data: preferences } =
    trpcClient.preferences.getMyPreferences.useQuery();
  const handleDataSource = () => {
    if (!projects) return [];
    return projects;
  };

  const tableOptions: TableOptions[] = [
    {
      onClick: () =>
        preferences?.selectedOrganization
          ? onOpen()
          : myToast.error("Favor seleccione una organización"),
      label: "Crear proyecto",
    },
    {
      onClick: () => setGlobalFilter(true),
      label: `${globalFilter ? "✅" : "❌"} Filtro global`,
    },
    {
      onClick: () => setGlobalFilter(false),
      label: `${!globalFilter ? "✅" : "❌"} Filtro local`,
    },
  ];

  const rowOptionsFunction: RowOptionsType = ({ x, setMenuData }) => {
    return (
      <RowOptionsModProjects
        setMenuData={setMenuData}
        x={x}
        onEditOpen={onEditOpen}
        setEditProject={setEditProject}
      />
    );
  };

  return (
    <>
      <DynamicTable
        title={"Proyectos"}
        columns={projectsColumn()}
        rowOptions={rowOptionsFunction}
        loading={isFetching || isLoading}
        options={tableOptions}
        data={handleDataSource() ?? []}
        {...dynamicTableProps}
      />

      {editProject && (
        <EditProjectModal
          project={editProject}
          isOpen={isEditOpen}
          onClose={onEditClose}
        />
      )}

      {preferences?.selectedOrganization && (
        <CreateProjectModal
          orgId={preferences.selectedOrganization}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default ProjectsTable;
