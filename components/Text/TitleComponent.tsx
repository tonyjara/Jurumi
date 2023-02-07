import { Text } from '@chakra-ui/react';
import React from 'react';

const TitleComponent = ({ title }: { title: string }) => {
  return (
    <Text fontWeight={'bold'} fontSize={{ base: '2xl', md: '3xl' }}>
      {title}
    </Text>
  );
};

export default TitleComponent;
