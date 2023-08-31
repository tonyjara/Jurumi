import "react-day-picker/dist/style.css";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";
import { trpcClient } from "../lib/utils/trpcClient";
import { appWithTranslation } from "next-i18next";
import NextNProgress from "nextjs-progressbar";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import { theme } from "../styles/Theme";
import BrowserNotificationsManager from "@/components/Notifications/BrowserNotificationsManager";
import RootLayout from "layouts/RootLayout";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  //RootLayout is 50kb on every page
  // Progress bar and notifications are 30kb on every page
  // Toaster is 1kb on every page
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
