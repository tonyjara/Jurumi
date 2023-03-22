import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ChakraProvider } from '@chakra-ui/react';
import { trpcClient } from '../lib/utils/trpcClient';
import { appWithTranslation } from 'next-i18next';
import NextNProgress from 'nextjs-progressbar';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import RootLayout from '../layouts/RootLayout';
import { theme } from '../styles/Theme';
import BrowserNotificationsManager from '@/components/Notifications/BrowserNotificationsManager';
import Tracker from '@openreplay/tracker';
import { useEffect } from 'react';

const tracker = new Tracker({
  projectKey: process.env.NEXT_PUBLIC_OPEN_REPLAY_KEY,
  ingestPoint: process.env.NEXT_PUBLIC_OPEN_REPLAY_INGEST_POINT,
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  useEffect(() => {
    tracker.start();
    tracker.setUserID(session?.user.email ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <NextNProgress height={4} />
        <BrowserNotificationsManager />
        <Toaster />
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </ChakraProvider>
    </SessionProvider>
  );
};

export default trpcClient.withTRPC(appWithTranslation(MyApp));
