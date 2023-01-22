import { useDynamicTable } from '@/components/DynamicTables/UseDynamicTable';
import BigStat from '@/components/Stats/BigStat';
import SmallStat from '@/components/Stats/SmallStat';
import {
  forMatedreduceCostCatAsignedAmount,
  reduceCostCatAsignedAmount,
} from '@/lib/utils/CostCatUtilts';
import { decimalFormat } from '@/lib/utils/DecimalHelpers';
import { projectExecutedAmount } from '@/lib/utils/ProjectUtils';
import { trpcClient } from '@/lib/utils/trpcClient';
import {
  StatGroup,
  Progress,
  Text,
  Box,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { Prisma } from '@prisma/client';
import React from 'react';
import TransactionsTable from '../transactions/TransactionsTable';
import type { ProjectComplete } from './ProjectsPage.mod.projects';
import CostCategoryStats from './ProjectsTable/CostCategoryStats.mod.projects';

const ProjectStats = ({
  project,
}: {
  project: ProjectComplete | undefined;
}) => {
  const labelColor = useColorModeValue('gray.600', 'gray.300');
  const dynamicTableProps = useDynamicTable();

  const { pageIndex, globalFilter, pageSize, sorting } = dynamicTableProps;
  const imbursed =
    project?.transactions[0]?.currentBalance ?? new Prisma.Decimal(0);
  const executedInGs = project
    ? projectExecutedAmount({ costCats: project?.costCategories }).gs
    : new Prisma.Decimal(0);
  const assignedAmount = project
    ? reduceCostCatAsignedAmount({
        costCats: project.costCategories,
        currency: 'PYG',
      })
    : new Prisma.Decimal(0);

  const percentageExecuted =
    executedInGs.dividedBy(assignedAmount).toNumber() * 100;

  const {
    data: getProjectWTx,
    isLoading,
    isFetching,
  } = trpcClient.project.getProjectTransactions.useQuery(
    {
      pageIndex,
      pageSize,
      sorting: globalFilter ? sorting : null,
      projectId: project?.id,
    },
    { keepPreviousData: globalFilter ? true : false, enabled: !!project }
  );

  return (
    <div>
      <StatGroup mb={'20px'}>
        <BigStat
          label="Asignado en Gs."
          value={decimalFormat(assignedAmount, 'PYG')}
        />
        <BigStat
          label="Asignado en Usd."
          value={
            project
              ? forMatedreduceCostCatAsignedAmount({
                  costCats: project.costCategories,
                  currency: 'USD',
                })
              : 0
          }
        />
      </StatGroup>

      <StatGroup gap={5}>
        <SmallStat
          color="teal"
          label="Desembolsado"
          value={decimalFormat(
            imbursed,
            project?.transactions[0]?.currency ?? 'PYG'
          )}
        />
        <SmallStat
          color="orange.300"
          label="Ejecutado."
          value={decimalFormat(executedInGs, 'PYG')}
        />
      </StatGroup>
      <Box my={'20px'}>
        <Text fontSize={'lg'} color={labelColor} mb={'10px'}>
          {isNaN(percentageExecuted) ? 0 : percentageExecuted.toFixed(0)}%
          Ejecutado
        </Text>
        <Progress
          borderRadius={'8px'}
          colorScheme={'orange'}
          value={isNaN(percentageExecuted) ? 0 : percentageExecuted}
        />
      </Box>
      <Divider />
      <CostCategoryStats project={project} />

      <TransactionsTable
        loading={isLoading || isFetching}
        data={getProjectWTx?.transactions ?? ([] as any)}
        count={getProjectWTx?._count.transactions}
        dynamicTableProps={dynamicTableProps}
      />
    </div>
  );
};

export default ProjectStats;
