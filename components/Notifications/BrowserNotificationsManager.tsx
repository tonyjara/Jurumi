import { firebaseApp } from '@/lib/firebase/firebaseConfig';
import { trpcClient } from '@/lib/utils/trpcClient';
import { BellIcon } from '@chakra-ui/icons';
import { Button, Card, Flex, Text } from '@chakra-ui/react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const BrowserNotificationsManager = () => {
  const user = useSession().data?.user;
  const cloudMessagingKeyPair = process.env.NEXT_PUBLIC_FB_MESSAGING_KEY;
  const [mounted, setMounted] = useState(false);
  const notificationsAreSupported = () =>
    typeof window !== 'undefined' && Notification !== undefined;
  const router = useRouter();
  const context = trpcClient.useContext();

  const notificationToast = ({
    title,
    message,
    url,
  }: {
    title: string | undefined;
    message: string | undefined;
    url: string | undefined;
  }) =>
    toast.custom((t) => (
      <Card
        cursor={'pointer'}
        justifyContent={'space-between'}
        onClick={() => url && router.push(url)}
        maxW={'300px'}
        padding={'15px'}
        boxShadow="2xl"
        transition="0.5s ease"
      >
        <Flex gap="3" alignItems={'center'}>
          <BellIcon color={'teal'} fontSize={'2xl'} />
          <Flex flexDir={'column'}>
            <Text fontWeight={'bold'}>{title}</Text>

            <Text fontSize={'sm'}>{message}</Text>
          </Flex>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              toast.dismiss(t.id);
            }}
            variant={'ghost'}
            size="sm"
          >
            Cerrar
          </Button>
        </Flex>
      </Card>
    ));

  const onFbMessage = async () => {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      notificationToast({
        title: payload.notification?.title,
        message: payload.notification?.body,
        url: payload.data?.url,
      });
      context.invalidate();
    });
  };

  if (mounted) {
    onFbMessage();
  }

  const { mutate } = trpcClient.notifications.upsertFcm.useMutation();

  const saveToken = async () => {
    try {
      const messaging = getMessaging(firebaseApp);

      const token = await getToken(messaging, {
        vapidKey: cloudMessagingKeyPair,
      });

      mutate({ token });
    } catch (err) {
      console.error('An error occurred while retrieving token. ', err);
      return null;
    }
  };

  let permissions = notificationsAreSupported()
    ? Notification.permission
    : null;

  useEffect(() => {
    if (!permissions || !user) return;
    if (permissions === 'default') {
      saveToken();
    }
    if (permissions === 'granted') {
      setMounted(true);
      saveToken();
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return <></>;
};

export default BrowserNotificationsManager;
