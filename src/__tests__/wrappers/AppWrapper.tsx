import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

export const ThemeWrapper = ({ children }: { children: React.ReactNode }) => (
  <ChakraProvider>{children}</ChakraProvider>
);
