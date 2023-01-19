import HorizontalBarchart from '@/components/Charts/HorizontalBarchart';
import { forMatedreduceCostCatAsignedAmount } from '@/lib/utils/CostCatUtilts';
import { projectExecutedAmount } from '@/lib/utils/ProjectUtils';

import { trpcClient } from '@/lib/utils/trpcClient';
import {
  Card,
  CardBody,
  CardHeader,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
} from '@chakra-ui/react';
import type { CostCategory, Currency, Project } from '@prisma/client';
import type { Decimal } from '@prisma/client/runtime';
import React, { useState } from 'react';
import ProjectMembers from './ProjectMembers.mod.projects';
import ProjectsTable from './ProjectsTable/ProjectsTable.mod.projects';
import ProjectSelect from './SelectProject.mod.projects';

export type ProjectComplete = Project & {
  costCategories: (CostCategory & {
    transactions: {
      openingBalance: Decimal;
      currency: Currency;
      currentBalance: Decimal;
      transactionAmount: Decimal;
    }[];
  })[];
  allowedUsers: {
    id: string;
    email: string;
    displayName: string;
  }[];
  _count: {
    allowedUsers: number;
  };
  transactions: {
    openingBalance: Decimal;
    currency: Currency;
    currentBalance: Decimal;
    transactionAmount: Decimal;
  }[];
};

const ProjectsPage = () => {
  const [selectedProject, setSelectedProject] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const backgroundColor = useColorModeValue('white', 'gray.800');

  const { data: projects } = trpcClient.project.getManyForTable.useQuery({});

  const options = projects
    ? projects.map((opt) => ({
        value: opt.id,
        label: opt.displayName,
      }))
    : [];

  const project = projects?.find((x) => x.id === selectedProject?.value);

  const projectsCats = projects?.map((x) => x.displayName);

  // const projectsCats = ['Asignado', 'Ejecutado', 'Desembolsado'];

  //Projects should have, total assigned, executed and imbursed
  const projectsSeries: ApexNonAxisChartSeries | ApexAxisChartSeries = [
    {
      name: 'Asignado',
      data: projects?.map((x) =>
        forMatedreduceCostCatAsignedAmount({
          costCats: x.costCategories,
          currency: 'PYG',
        })
      ) ?? [0],
    },
    {
      name: 'Desembolsado',
      data: projects?.map(
        (x) => x.transactions[0]?.currentBalance.toNumber() ?? 0
      ) ?? [0],
    },
    {
      name: 'Ejecutado',
      data: projects?.map(
        (x) =>
          projectExecutedAmount({
            costCats: x.costCategories,
          }).gs.toNumber() ?? 0
      ) ?? [0],
    },
  ];

  return (
    <>
      <Card backgroundColor={backgroundColor}>
        <Tabs overflow={'auto'}>
          <CardHeader>
            <Stack
              flexDir={{ base: 'column', md: 'row' }}
              // justifyContent="space-between"
            >
              <TabList px={'10px'}>
                <Tab>General</Tab>
                <Tab>Miembros</Tab>
                <Tab>Lista</Tab>
              </TabList>
              <div
                style={{
                  minWidth: '300px',
                  paddingLeft: '10px',
                  paddingRight: '10px',
                }}
              >
                <ProjectSelect
                  options={options}
                  setSelectedProject={setSelectedProject}
                />
              </div>
            </Stack>
          </CardHeader>
          <CardBody>
            <TabPanels>
              <TabPanel>
                {!selectedProject && (
                  <HorizontalBarchart
                    series={projectsSeries}
                    title="Proyectos"
                    categories={projectsCats}
                  />
                )}
              </TabPanel>
              <TabPanel>
                <ProjectMembers project={project} />
              </TabPanel>
              <TabPanel>
                <ProjectsTable />
              </TabPanel>
            </TabPanels>
          </CardBody>
        </Tabs>
      </Card>
    </>
  );
};

export default ProjectsPage;
