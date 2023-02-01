import prisma from '@/server/db/client';
import type { MoneyRequestApproval } from '@prisma/client';
import { WebClient } from '@slack/web-api';

export const reqApprovalRejection = async ({
  input,
}: {
  input: MoneyRequestApproval & {
    account: {
      displayName: string;
    };
    moneyRequest: {
      organizationId: string;
    };
  };
}) => {
  const org = await prisma?.organization.findUniqueOrThrow({
    where: { id: input.moneyRequest.organizationId },
    select: {
      moneyAdministrators: { select: { id: true } },
      orgNotificationSettings: true,
    },
  });

  if (!org?.moneyAdministrators.length) return;
  if (!org.orgNotificationSettings?.administratorsSlackChannelId) return;

  const slackToken = process.env.SLACK_BOT_TOKEN;

  const web = new WebClient(slackToken);

  await web.chat.postMessage({
    text: `${
      input.account.displayName
    } ha a rechazado una solicitud. Motivo: "${
      input.rejectMessage
    }". Vistiar este link: ${
      process.env.NEXT_PUBLIC_WEB_URL +
      `/mod/requests?moneyRequestId=${input.moneyRequestId}`
    }`,
    channel: org.orgNotificationSettings.administratorsSlackChannelId,
    icon_emoji: '❌',
  });
};
