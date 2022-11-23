import React from 'react';
import dynamic from 'next/dynamic';
import { Container } from '@chakra-ui/react';

const Overview = dynamic(
  () => import('../../../components/OrgCharts/orgChart.view.main'),
  {
    ssr: false,
  }
);
const MainView = () => {
  return (
    <Container pt={10}>
      <Overview />
    </Container>
  );
};

export default MainView;
