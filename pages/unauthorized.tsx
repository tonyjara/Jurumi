import { Container, Heading } from '@chakra-ui/react';
import React from 'react';
import NotAvailableLottie from '../components/Spinners-Loading/NotAvailableLottie';

const UnauthorizedPage = () => {
  return (
    <Container>
      <Heading>No tienes los permisos para acceder esta ruta.</Heading>
      {NotAvailableLottie()}
    </Container>
  );
};

export default UnauthorizedPage;
