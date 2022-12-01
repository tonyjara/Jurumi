import { HStack } from '@chakra-ui/react';
import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
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
          {orgs?.map((org) => (
            <Tree
              key={org.id}
              label={<OrgCard displayName={org.displayName} id={org.id} />}
            >
              {projects
                ?.filter((x) => x.organizationId === org.id)
                .map((project) => (
                  <TreeNode
                    key={project.id}
                    label={<ProjectCard {...project} />}
                  >
                    <TreeNode label={<div>Grand Child</div>} />
                  </TreeNode>
                ))}
            </Tree>
          ))}
        </HStack>
      )}
      {(isLoading || isProjectsLoading) && <LoadingPlantLottie />}
      {(error || projectError) && <ErrorBotLottie />}
    </>
  );
};

export default ProjectCardGroup;
