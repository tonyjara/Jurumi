import { z } from 'zod';
import { router, protectedProcedure, adminModProcedure } from '../initTrpc';
import prisma from '@/server/db/client';
import { sub, subMonths } from 'date-fns';
import axios from 'axios';
import { WebClient } from '@slack/web-api';
import { validateOrgNotificationSettings } from '@/lib/validations/orgNotificationsSettings.validate';

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
  sendSlackChannelMessage: adminModProcedure
    .input(z.object({ channelId: z.string() }))
    .mutation(async ({ input }) => {
      if (!input.channelId.length) return;
      const slackToken = process.env.SLACK_BOT_TOKEN;

      const web = new WebClient(slackToken);

      const result = await web.chat.postMessage({
        text: 'Hello world!',
        channel: input.channelId,
      });
      console.log(result);
    }),
  getWorkSpace: adminModProcedure.query(async () => {
    const slackToken = process.env.SLACK_BOT_TOKEN;

    const web = new WebClient(slackToken);

    const result = await web.auth.test();

    return result.team;
  }),
  saveOrgNotificationSettings: adminModProcedure
    .input(validateOrgNotificationSettings)
    .mutation(async ({ input }) => {
      await prisma.orgNotificationSettings.upsert({
        where: { orgId: input.orgId },
        create: {
          orgId: input.orgId,
          allowNotifications: input.allowNotifications,
          administratorsSlackChannelId: input.administratorsSlackChannelId,
          approversSlackChannelId: input.approversSlackChannelId,
        },
        update: {
          allowNotifications: input.allowNotifications,
          administratorsSlackChannelId: input.administratorsSlackChannelId,
          approversSlackChannelId: input.approversSlackChannelId,
        },
      });
    }),

  getOrgNotificationSettings: adminModProcedure
    .input(z.object({ orgId: z.string().optional() }))
    .query(async ({ input }) => {
      if (!input.orgId) return null;
      return await prisma.orgNotificationSettings.findUnique({
        where: { orgId: input.orgId },
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
