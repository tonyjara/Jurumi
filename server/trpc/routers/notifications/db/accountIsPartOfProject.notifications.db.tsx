import type { Project } from '@prisma/client';
import type { TxCtx } from './PrismaTypes';
export const accountIsPartOfProjectDbNotification = async ({
  accountId,
  project,
  txCtx,
}: {
  accountId: string;
  project: Project;
  txCtx: TxCtx;
}) => {
  await txCtx.notifications.create({
    data: {
      title: 'Has sido invitado a un proyecto!',
      message: `Fuiste invitado a ser parte del proyecto ${project.displayName}`,
      url: '',
      accountId: accountId,
    },
  });
};
