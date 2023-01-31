import { z } from 'zod';
import { router, protectedProcedure, adminModProcedure } from '../initTrpc';
import prisma from '@/server/db/client';
import { sub, subMonths } from 'date-fns';
import axios from 'axios';

export const notificationsRouter = router({
  upsertFcm: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      await prisma.fcmNotificationTokens.upsert({
        where: { token: input.token },
        create: { token: input.token, accountId: user.id },
        update: { updatedAt: new Date() },
      });
    }),
  notifyAll: adminModProcedure.query(async () => {
    const getTokens = await prisma.fcmNotificationTokens.findMany({
      select: { token: true },
      where: {
        updatedAt: {
          gte: subMonths(new Date(), 3),
        },
      },
    });

    for (const x of getTokens) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=${process.env.FCM_SERVER_KEY}`,
        },
      };

      await axios.post(
        `https://fcm.googleapis.com/fcm/send`,
        {
          to: x.token,
          notification: {
            body: 'BODYYYYYYY',
            title: 'TITLEEEEEE',
          },
          data: { url: '/home/expense-reports' },
        },
        config
      );
    }

    return getTokens.length;
  }),
});
