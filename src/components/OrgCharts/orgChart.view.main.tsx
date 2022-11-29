import { HStack, Text, VStack } from '@chakra-ui/react';
import type { BankAccount } from '@prisma/client';
import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { trpcClient } from '../../lib/utils/trpcClient';
import ErrorBotLottie from '../Spinners-Loading/ErrorBotLottie';
import LoadingPlantLottie from '../Spinners-Loading/LoadiingPlantLottie';
import BankAccCard from './Cards/bankAcc.card';
import OrgCard from './Cards/org.card';
import ProjectCard from './Cards/project.card';

const MainOverview = () => {
  //orgs
  const { data: orgs, isLoading, error } = trpcClient.org.getMany.useQuery(); //bankAccs
  const {
    data: bankAccs,
    isLoading: isBankLoading,
    error: bankError,
  } = trpcClient.bankAcc.getMany.useQuery();

  //projects
  const {
    data: projects,
    isLoading: isProjectsLoading,
    error: projectError,
  } = trpcClient.project.getMany.useQuery();

  const reduceToGs = (bankAccs?: BankAccount[]) =>
    bankAccs
      ?.reduce((acc, bankAcc) => {
        if (bankAcc.currency === 'PYG') {
          return (acc += parseFloat(bankAcc.balance.toString()));
        }
        return acc;
      }, 0)
      .toLocaleString('es');
  const reduceToUsd = (bankAccs?: BankAccount[]) =>
    bankAccs
      ?.reduce((acc, bankAcc) => {
        if (bankAcc.currency === 'USD') {
          return (acc += parseFloat(bankAcc.balance.toString()));
        }
        return acc;
      }, 0)
      .toLocaleString('en-US');

  return (
    <VStack transform={'scale(0.5)'}>
      <>
        {!isBankLoading && (
          <fieldset
            style={{
              borderWidth: '1px',
              borderRadius: '8px',
              padding: '10px',
              borderStyle: 'solid',
              borderColor: 'purple',
              margin: '10px',
            }}
          >
            <Text fontWeight={'bold'} as={'legend'}>
              Cuentas bancarias. Total Dólares: {reduceToUsd(bankAccs)} Total
              Guaraníes: {reduceToGs(bankAccs)}
            </Text>
            <HStack>
              {bankAccs?.map((bankAcc) => (
                <BankAccCard key={bankAcc.id} {...bankAcc} />
              ))}
            </HStack>
          </fieldset>
        )}
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

        {(isLoading || isBankLoading || isProjectsLoading) && (
          <LoadingPlantLottie />
        )}
        {(error || bankError || projectError) && <ErrorBotLottie />}
      </>
    </VStack>
  );
};

export default MainOverview;
