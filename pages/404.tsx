import { Container, Heading } from '@chakra-ui/react';
import React from 'react';
import ErrorBotLottie from '../components/Spinners-Loading/ErrorBotLottie';

const NotFound = () => {
  return (
    <Container>
      <Heading>Oops. No encontramos lo que estabas buscando</Heading>
      {ErrorBotLottie()}
    </Container>
  );
};

export default NotFound;
