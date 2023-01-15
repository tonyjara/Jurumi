import HorizontalBarchart from '@/components/Charts/HorizontalBarchart';
import type { TableOptions } from '@/components/DynamicTables/DynamicTable';
import ThreeDotTableButton from '@/components/DynamicTables/Utils/ThreeDotTableButton';
import CreateProjectModal from '@/components/Modals/project.create.modal';
import { myToast } from '@/components/Toasts/MyToast';

import { trpcClient } from '@/lib/utils/trpcClient';
import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import type { CostCategory, Project } from '@prisma/client';
import React, { useState } from 'react';
import ProjectMembers from './ProjectMembers.mod.projects';
import ProjectsTable from './ProjectsTable/ProjectsTable.mod.projects';
import ProjectSelect from './SelectProject.mod.projects';

export type ProjectComplete = Project & {
  costCategories: CostCategory[];
  allowedUsers: {
    id: string;
    email: string;
    displayName: string;
  }[];
};

const ProjectsPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProject, setSelectedProject] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const backgroundColor = useColorModeValue('white', 'gray.800');

  const { data: projects, isLoading } = trpcClient.project.getMany.useQuery();
  const { data: preferences } =
    trpcClient.preferences.getMyPreferences.useQuery();

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
    { name: 'Asignado', data: [100000, 200000, 30000] },
    { name: 'Desembolsado', data: [90000, 100000, 20000] },
    { name: 'Ejecutado', data: [2000, 24000, 3400] },
  ];

  const tableOptions: TableOptions[] = [
    {
      onClick: () =>
        preferences?.selectedOrganization
          ? onOpen()
          : myToast.error('Favor seleccione una organización'),
      label: 'Crear proyecto',
    },
  ];

  return (
    <>
      <Tabs>
        <Card backgroundColor={backgroundColor}>
          <CardHeader>
            <Flex justifyContent="space-between">
              <div style={{ minWidth: '300px' }}>
                <ProjectSelect
                  options={options}
                  setSelectedProject={setSelectedProject}
                />
              </div>
              <TabList>
                <Tab>General</Tab>
                <Tab>Miembros</Tab>
                <Tab>Lista</Tab>
              </TabList>

              <ThreeDotTableButton options={tableOptions} />
            </Flex>
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
                {/* {project && <HorizontalBarchart title={project.displayName} />} */}
              </TabPanel>
              <TabPanel>
                <ProjectMembers project={project} />
              </TabPanel>
              <TabPanel>
                <ProjectsTable />
              </TabPanel>
            </TabPanels>
          </CardBody>
        </Card>
      </Tabs>
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

export default ProjectsPage;
