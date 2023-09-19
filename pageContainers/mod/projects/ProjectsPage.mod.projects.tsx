import { trpcClient } from "@/lib/utils/trpcClient";
import {
  Card,
  CardHeader,
  Stack,
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import ProjectImbursementsReports from "./ProjectImbursementsReports/ProjectImbursementReports";
import ProjectMembers from "./ProjectMembers.mod.projects";
import ProjectReportsTable from "./ProjectReports/ProjectReportsTable";
import ProjectsTable from "./ProjectsTable/ProjectsTable.mod.projects";
import ProjectStats from "./ProjectStats.mod.projects";
import ProjectSelect from "./SelectProject.mod.projects";

const ProjectsPage = () => {
  const [selectedProject, setSelectedProject] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const backgroundColor = useColorModeValue("white", "gray.800");

  const { data: projects, isLoading } =
    trpcClient.project.getManyForTable.useQuery({});

  const options = projects
    ? projects.map((opt) => ({
        value: opt.id,
        label: opt.displayName,
      }))
    : [];

  const project = projects?.find((x) => x.id === selectedProject?.value);

  return (
    <Card w="100%" backgroundColor={backgroundColor}>
      <Tabs overflow={"auto"}>
        <CardHeader>
          <Stack
            flexDir={{ base: "column", lg: "row" }}
            alignItems={{ base: "start", lg: "center" }}
            justifyContent="space-between"
          >
            <Text fontWeight={"bold"} fontSize={{ base: "2xl", md: "3xl" }}>
              Proyectos
            </Text>

            <ProjectSelect
              loading={isLoading}
              options={options}
              setSelectedProject={setSelectedProject}
            />

            <TabList px={"10px"}>
              <Tab>Reportes</Tab>
              <Tab>Ejecución</Tab>
              <Tab>Miembros</Tab>
              <Tab>Lista</Tab>
            </TabList>
          </Stack>
        </CardHeader>
        <TabPanels minH={"90vh"}>
          <TabPanel>
            {/* Reportes */}
            <ProjectImbursementsReports project={project} />
            <ProjectReportsTable project={project} />
          </TabPanel>
          <TabPanel>
            {/* Ejecución */}
            <ProjectStats project={project} />
          </TabPanel>
          <TabPanel>
            {/* Miembros */}
            <ProjectMembers project={project} />
          </TabPanel>
          <TabPanel>
            {/* Lista */}
            <ProjectsTable />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Card>
  );
};

export default ProjectsPage;
