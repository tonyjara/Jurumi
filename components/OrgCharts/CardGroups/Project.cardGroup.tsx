import { HStack } from "@chakra-ui/react";
import React from "react";

import { trpcClient } from "../../../lib/utils/trpcClient";
import OrgCard from "../Cards/org.card";
import ProjectCard from "../Cards/project.card";

const ProjectCardGroup = () => {
  const { data: orgs, isLoading } = trpcClient.org.getMany.useQuery();

  const { data: projects } = trpcClient.project.getMany.useQuery();

  return (
    <>
      {!isLoading && (
        <HStack>
          {orgs?.map((org) => {
            return (
              <div key={org.id}>
                <OrgCard {...(org as any)} />
                <HStack m={"20px"}>
                  {projects
                    ?.filter((x) => x.organizationId === org.id)
                    .map((project) => (
                      <ProjectCard key={project.id} {...project} />
                    ))}
                </HStack>
              </div>
            );
          })}
        </HStack>
      )}
    </>
  );
};

export default ProjectCardGroup;
