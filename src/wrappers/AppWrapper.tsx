import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ChakraProvider } from '@chakra-ui/react';

import '../../styles/globals.css';
import React from 'react';

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ChakraProvider>{children}</ChakraProvider>
    </SessionProvider>
  );
};

export default AppWrapper;
