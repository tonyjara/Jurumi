import React from 'react';
import dynamic from 'next/dynamic';
import { Button, Flex, HStack } from '@chakra-ui/react';
import {
  TransformComponent,
  TransformWrapper,
} from '@pronestor/react-zoom-pan-pinch';
import CreateTablesSelect from './_CreateTablesSelect';

const Overview = dynamic(
  () => import('../../../components/OrgCharts/orgChart.view.main'),
  {
    ssr: false,
  }
);
const MainView = () => {
  return (
    <TransformWrapper
      // initialPositionX={-500}
      // initialPositionY={-100}
      initialScale={1.5}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <Flex>
          <HStack
            p={'10px'}
            backgroundColor={'gray.900'}
            zIndex={2}
            position={'absolute'}
          >
            <Button size="sm" onClick={() => zoomIn()}>
              ZOOM +
            </Button>
            <Button size="sm" onClick={() => zoomOut()}>
              ZOOM -
            </Button>
            <Button size="sm" onClick={() => resetTransform()}>
              RESET
            </Button>
          </HStack>
          <CreateTablesSelect />
          <TransformComponent>
            <Flex left={0} w={'100vw'} height={'100vh'}>
              <Overview />
            </Flex>
          </TransformComponent>
        </Flex>
      )}
    </TransformWrapper>
  );
};

export default MainView;
