import prisma from '@/server/db/client';
import type { MoneyRequest } from '@prisma/client';
import axios from 'axios';
import { subMonths } from 'date-fns';

export const moneyRequestApprovedBrowserNotification = async ({
  input,
}: {
  input: MoneyRequest & {
    account: {
      email: string;
      displayName: string;
      preferences: {
        receiveEmailNotifications: boolean;
      } | null;
    };
  };
}) => {
  const getTokens = await prisma.fcmNotificationTokens.findMany({
    select: { token: true },
    where: {
      accountId: input.accountId,
      updatedAt: {
        gte: subMonths(new Date(), 3),
      },
    },
  });

  const tokensWithNoDups = new Set<string>();
  getTokens.forEach((x) => tokensWithNoDups.add(x.token));

  for (const token of tokensWithNoDups) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${process.env.FCM_SERVER_KEY}`,
      },
    };

    await axios.post(
      `https://fcm.googleapis.com/fcm/send`,
      {
        to: token,
        notification: {
          body: 'Ve a tus solicitudes para ver los detalles del desembolso.',
          title: 'Tu solicitud ha sido aprobada!',
        },
        data: { url: '/home/requests' },
      },
      config
    );
  }
};
