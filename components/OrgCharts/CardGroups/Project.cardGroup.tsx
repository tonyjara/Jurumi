import { HStack } from '@chakra-ui/react';
import React from 'react';

import { trpcClient } from '../../../lib/utils/trpcClient';
import ErrorBotLottie from '../../Spinners-Loading/ErrorBotLottie';
import LoadingPlantLottie from '../../Spinners-Loading/LoadiingPlantLottie';
import OrgCard from '../Cards/org.card';
import ProjectCard from '../Cards/project.card';

const ProjectCardGroup = () => {
  const { data: orgs, isLoading, error } = trpcClient.org.getMany.useQuery();

  const {
    data: projects,
    isLoading: isProjectsLoading,
    error: projectError,
  } = trpcClient.project.getMany.useQuery();

  return (
    <>
      {!isLoading && (
        <HStack>
          {orgs?.map((org) => {
            return (
              <div key={org.id}>
                <OrgCard {...(org as any)} />
                <HStack m={'20px'}>
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
      {(isLoading || isProjectsLoading) && <LoadingPlantLottie />}
      {(error || projectError) && <ErrorBotLottie />}
    </>
  );
};

export default ProjectCardGroup;
