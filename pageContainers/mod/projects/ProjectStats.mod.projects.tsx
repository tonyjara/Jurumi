import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import BigStat from "@/components/Stats/BigStat";
import SmallStat from "@/components/Stats/SmallStat";
import {
  formatedReduceCostCatAsignedAmount,
  reduceCostCatAsignedAmount,
  reduceCostCatAsignedAmountsInGs,
} from "@/lib/utils/CostCatUtilts";
import { decimalFormat } from "@/lib/utils/DecimalHelpers";
import { projectExecutedAmount } from "@/lib/utils/ProjectUtils";
import { trpcClient } from "@/lib/utils/trpcClient";
import {
  StatGroup,
  Progress,
  Text,
  Box,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import React, { useState } from "react";
import TransactionsTable from "../transactions/TransactionsTable";
import { ProjectComplete } from "./project.types";
import CostCategoryStats from "./ProjectsTable/CostCategoryStats.mod.projects";

const ProjectStats = ({
  project,
}: {
  project: ProjectComplete | undefined;
}) => {
  const labelColor = useColorModeValue("gray.600", "gray.300");
  const dynamicTableProps = useDynamicTable();
  const [whereFilterList, setWhereFilterList] = useState<
    Prisma.TransactionScalarWhereInput[]
  >([]);

  const { pageIndex, pageSize, sorting } = dynamicTableProps;

  //! Should have own trpc req

  const { data: projectWithLastTx } =
    trpcClient.project.getLastProjectTransaction.useQuery({
      projectId: project?.id,
    });
  const { data: getProjectWithTransactions, isFetching } =
    trpcClient.project.getProjectTransactions.useQuery({
      pageIndex,
      pageSize,
      sorting,
      projectId: project?.id,
    });

  const imbursed = projectWithLastTx?.transactions[0]?.currentBalance
    ? projectWithLastTx?.transactions[0]?.currentBalance
    : new Prisma.Decimal(0);

  const executedInGs = projectExecutedAmount({
    costCats: project?.costCategories ?? [],
  }).gs;
  const assignedAmount = reduceCostCatAsignedAmount({
    costCats: project?.costCategories ?? [],
    currency: "PYG",
  });

  const totalAsignedInGs = reduceCostCatAsignedAmountsInGs(
    project?.costCategories ?? [],
  );

  const percentageExecuted =
    executedInGs.dividedBy(totalAsignedInGs).toNumber() * 100;

  return (
    <div>
      <StatGroup mb={"20px"}>
        <BigStat
          label="Total asignado en Gs."
          value={decimalFormat(totalAsignedInGs, "PYG")}
        />

        <BigStat label="En Gs." value={decimalFormat(assignedAmount, "PYG")} />
        <BigStat
          label="En Usd."
          value={formatedReduceCostCatAsignedAmount({
            costCats: project?.costCategories ?? [],
            currency: "USD",
          })}
        />
      </StatGroup>

      <StatGroup gap={5}>
        <SmallStat
          color="teal"
          label="Desembolsado"
          value={decimalFormat(
            imbursed,
            projectWithLastTx?.transactions[0]?.currency ?? "PYG",
          )}
        />
        <SmallStat
          color="orange.300"
          label="Ejecutado en Gs."
          value={decimalFormat(executedInGs, "PYG")}
        />
      </StatGroup>
      <Box my={"20px"}>
        <Text fontSize={"lg"} color={labelColor} mb={"10px"}>
          {isNaN(percentageExecuted) ? 0 : percentageExecuted.toFixed(0)}%
          Ejecutado{" "}
        </Text>
        <Progress
          borderRadius={"8px"}
          colorScheme={"orange"}
          value={isNaN(percentageExecuted) ? 0 : percentageExecuted}
        />
      </Box>
      <Divider />
      <CostCategoryStats project={project} />

      <TransactionsTable
        whereFilterList={whereFilterList}
        setWhereFilterList={setWhereFilterList}
        loading={isFetching}
        data={getProjectWithTransactions?.transactions ?? []}
        count={getProjectWithTransactions?._count?.transactions}
        dynamicTableProps={dynamicTableProps}
      />
    </div>
  );
};

export default ProjectStats;
