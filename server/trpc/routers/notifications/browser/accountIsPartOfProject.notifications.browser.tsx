import type { Project } from '@prisma/client';
import axios from 'axios';
import { subMonths } from 'date-fns';
import type { TxCtx } from '../db/PrismaTypes';

export const accountIsPartOfProjectBrowserNotifications = async ({
  txCtx,
  project,
  accountId,
}: {
  accountId: string;
  project: Project;
  txCtx: TxCtx;
}) => {
  const getTokens = await txCtx.fcmNotificationTokens.findMany({
    select: { token: true },
    where: {
      accountId: accountId,
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
          body: `Fuiste invitado a ser parte del proyecto ${project.displayName}`,
          title: 'Fuiste invitado a un proyecto!',
        },
        // data: { url: '/home/requests' },
      },
      config
    );
  }
};
