import DynamicTable, {
  TableOptions,
} from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import { trpcClient } from "@/lib/utils/trpcClient";
import React from "react";
import { ProjectComplete } from "../ProjectsPage.mod.projects";
import { projectReportsColumn } from "./colums.mod.ProjectReports";

const ProjectReportsTable = ({
  project,
}: {
  project: ProjectComplete | undefined;
}) => {
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, setGlobalFilter, globalFilter, pageSize, sorting } =
    dynamicTableProps;

  const { data, isLoading } = trpcClient.reports.getProjectReport.useQuery({
    projectId: project?.id,
  });

  return (
    <>
      <DynamicTable
        title={"Ejecución por linea Presupuestaria"}
        data={data ?? []}
        loading={isLoading}
        columns={projectReportsColumn({ pageSize, pageIndex })}
        {...dynamicTableProps}
      />
    </>
  );
};

export default ProjectReportsTable;
