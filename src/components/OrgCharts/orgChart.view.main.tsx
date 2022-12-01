import { HStack, VStack } from '@chakra-ui/react';
import React from 'react';
import BankAccCardGroup from './CardGroups/BankAcc.cardGroup';
import PettyCashCardGroup from './CardGroups/PettyCash.cardGroup';
import ProjectCardGroup from './CardGroups/Project.cardGroup';

const MainOverview = () => {
  return (
    <VStack transform={'scale(0.5)'}>
      <>
        <HStack>
          <BankAccCardGroup />
          <PettyCashCardGroup />
        </HStack>
        <ProjectCardGroup />
      </>
    </VStack>
  );
};

export default MainOverview;
