import DynamicTable from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import { trpcClient } from "@/lib/utils/trpcClient";
import React from "react";
import { ProjectComplete } from "../ProjectsPage.mod.projects";
import { projectReportsColumn } from "./colums.mod.ProjectReports";
import { rawValuesProjectReportsTable } from "./rawValues.ProjectReportsTable";

const ProjectReportsTable = ({
  project,
}: {
  project: ProjectComplete | undefined;
}) => {
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, pageSize } = dynamicTableProps;

  const { data, isLoading } = trpcClient.reports.getProjectReport.useQuery({
    projectId: project?.id,
  });

  return (
    <DynamicTable
      showFooter
      title={"Ejecución por linea Presupuestaria"}
      data={data ?? []}
      loading={isLoading}
      columns={projectReportsColumn({ pageSize, pageIndex })}
      rawValuesDictionary={rawValuesProjectReportsTable}
      {...dynamicTableProps}
    />
  );
};

export default ProjectReportsTable;
