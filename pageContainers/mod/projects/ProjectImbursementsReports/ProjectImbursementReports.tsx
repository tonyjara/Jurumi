import DynamicTable from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import { trpcClient } from "@/lib/utils/trpcClient";
import React from "react";
import { ProjectComplete } from "../ProjectsPage.mod.projects";
import { projectImbursementsReportsColumns } from "./columns.mod.ProjectImbursementsReports";

const ProjectImbursementsReports = ({
  project,
}: {
  project: ProjectComplete | undefined;
}) => {
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, pageSize } = dynamicTableProps;

  const { data, isLoading } =
    trpcClient.reports.getProjectImbursements.useQuery({
      projectId: project?.id,
    });

  return (
    <DynamicTable
      showFooter
      title={"Desembolsos"}
      data={data ?? []}
      loading={isLoading}
      columns={projectImbursementsReportsColumns({ pageSize, pageIndex })}
      {...dynamicTableProps}
    />
  );
};

export default ProjectImbursementsReports;
