import type { MoneyRequest } from '@prisma/client';
import type { TxCtx } from './PrismaTypes';
export const moneyRequestApprovedDbNotification = async ({
  input,
  txCtx,
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
  txCtx: TxCtx;
}) => {
  await txCtx.notifications.create({
    data: {
      title: 'Se ha aprobado tu solicitud',
      message: 'Ve a tus solicitudes para ver los detalles del desembolso.',
      url: '/home/requests',
      accountId: input.accountId,
    },
  });
};
