import { Container, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const FormContainer = ({ children }: { children: React.ReactNode }) => {
  const backgroundColor = useColorModeValue('white', 'gray.700');

  return (
    <Container
      maxW={'700px'}
      p="15px"
      borderRadius={'8px'}
      backgroundColor={backgroundColor}
    >
      {children}
    </Container>
  );
};

export default FormContainer;
