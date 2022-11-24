import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ChakraProvider } from '@chakra-ui/react';
import { trpcClient } from '../lib/utils/trpcClient';

import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <Toaster />
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
};

export default trpcClient.withTRPC(MyApp);
