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
import type { CostCategory, Currency, Project } from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime";
import React, { useState } from "react";
import ProjectMembers from "./ProjectMembers.mod.projects";
import ProjectsTable from "./ProjectsTable/ProjectsTable.mod.projects";
import ProjectStats from "./ProjectStats.mod.projects";
import ProjectSelect from "./SelectProject.mod.projects";

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
                        flexDir={{ base: "column", md: "row" }}
                        alignItems={{ base: "start", md: "center" }}
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
                            <Tab>General</Tab>
                            <Tab>Miembros</Tab>
                            <Tab>Lista</Tab>
                        </TabList>
                    </Stack>
                </CardHeader>
                <TabPanels>
                    <TabPanel>
                        <ProjectStats project={project} />
                    </TabPanel>
                    <TabPanel>
                        <ProjectMembers project={project} />
                    </TabPanel>
                    <TabPanel>
                        <ProjectsTable />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Card>
    );
};

export default ProjectsPage;
