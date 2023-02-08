import prisma from '@/server/db/client';
import type { MoneyRequest } from '@prisma/client';
export const moneyRequestApprovedDbNotification = async ({
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
  await prisma.notifications.create({
    data: {
      title: 'Se ha aprobado tu solicitud',
      message: 'Ve a tus solicitudes para ver los detalles del desembolso.',
      url: '/home/requests',
      accountId: input.accountId,
    },
  });
};
