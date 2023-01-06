import React from 'react';
// import dynamic from 'next/dynamic';
import { Flex } from '@chakra-ui/react';
import {
  TransformComponent,
  TransformWrapper,
} from '@pronestor/react-zoom-pan-pinch';
import CreateTablesSelect from './CreateTablesSelect.mod.views';
import MainOrgChart from '@/components/OrgCharts/orgChart.view.main';

const MainViewPage = () => {
  return (
    <TransformWrapper initialPositionY={-100} initialScale={1.5}>
      <>
        <CreateTablesSelect />
        <TransformComponent>
          <Flex w={'100vw'} height={'100vh'}>
            <MainOrgChart />
          </Flex>
        </TransformComponent>
      </>
    </TransformWrapper>
  );
};

export default MainViewPage;
