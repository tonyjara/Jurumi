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
// import { messaging } from '@/server/firebase/firebaseConfig';
import { myToast } from '@/components/Toasts & Alerts/MyToast';
import { useEffect } from 'react';

interface notificationPayload {
  title: string;
  body: string;
  icon: string;
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const notificationsAreSupported = () =>
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window;

  let permissions = notificationsAreSupported()
    ? Notification.permission
    : null;

  const cloudMessagingKeyPair = process.env.NEXT_PUBLIC_FB_MESSAGING_KEY;

  const getToken = async () => {
    try {
      // const currentToken =
      //   messaging &&
      //   (await messaging.getToken({ vapidKey: cloudMessagingKeyPair }));
      // if (currentToken && storeData) {
      //   if (
      //     userProfile &&
      //     !userProfile.deviceNotificationTokens?.includes(currentToken)
      //   ) {
      //     console.log("fcmta");
      //     dispatch(
      //       addDeviceToken({ token: currentToken, userId: userProfile?.uid })
      //     );
      //   } else {
      //     //do nothing
      //   }
      // } else {
      //   // Show permission request UI
      // }
    } catch (err) {
      console.log('An error occurred while retrieving token. ', err);
    }
  };

  useEffect(() => {
    if (notificationsAreSupported()) {
      if (permissions === 'default') {
        // dispatch(
        //   setNewAlert({
        //     type: "confirm",
        //     title: "Atención",
        //     icon: "warning",
        //     callback: () => getToken(),
        //     onReject: () => getToken(),

        //     subTitle:
        //       "Algunas funcionalidades de Kuic requieren enviarle notificaciones para manejar su negocio de manera óptima, favor acepte recibir notificationes.",
        //   })
        // );
        console.log('isDefault');
      } else if (permissions === 'granted') {
        getToken();
      }
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions]);
  // }, [permissions, userProfile?.deviceNotificationTokens]);

  // messaging?.onMessage((payload: any) => {
  //   // console.log(payload);
  //   const notification = payload.notification as notificationPayload;
  //   myToast.success(
  //     notification.title
  //     // subTitle: notification.body,
  //     // icon: "warning",
  //     // type: "confirm",
  //     // showCancelButton: false,
  //     // confirmButtonText: "Ok",
  //   );
  // });

  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <NextNProgress height={4} />
        <Toaster />
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </ChakraProvider>
    </SessionProvider>
  );
};

export default trpcClient.withTRPC(appWithTranslation(MyApp));
