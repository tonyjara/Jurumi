import { translatedMoneyReqType } from '@/lib/utils/TranslatedEnums';
import prisma from '@/server/db/client';
import type { MoneyRequest } from '@prisma/client';
import { WebClient } from '@slack/web-api';

export const createMoneyRequestSlackNotification = async ({
  input,
}: {
  input: MoneyRequest & {
    account: {
      displayName: string;
    };
  };
}) => {
  const org = await prisma?.organization.findUniqueOrThrow({
    where: { id: input.organizationId },
    select: {
      moneyRequestApprovers: { select: { id: true } },
      orgNotificationSettings: true,
    },
  });

  if (!org.orgNotificationSettings?.allowNotifications) return;

  if (org?.moneyRequestApprovers.length) {
    if (!org.orgNotificationSettings?.approversSlackChannelId) return;
    const slackToken = process.env.SLACK_BOT_TOKEN;

    const web = new WebClient(slackToken);

    await web.chat.postMessage({
      text: `${
        input.account.displayName
      } ha creado una nueva solicitud del tipo ${translatedMoneyReqType(
        input.moneyRequestType
      )}. Vistiar este link: ${
        process.env.NEXT_PUBLIC_WEB_URL + '/mod/approvals'
      }`,
      channel: org.orgNotificationSettings.approversSlackChannelId,
      icon_emoji: '🔔',
    });
  }
};
