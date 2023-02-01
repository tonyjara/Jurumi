import { z } from 'zod';
import { adminModProcedure, router } from '../initTrpc';
import prisma from '@/server/db/client';
import { reqApprovalApproved } from './notifications/reqApprovalApproved.notification';
import { reqApprovalRejection } from './notifications/reqApprovalRejection.notification';

export const moneyApprovalRouter = router({
  approve: adminModProcedure
    .input(z.object({ moneyRequestId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;

      const prevApproval = await prisma?.moneyRequestApproval.findFirst({
        where: { accountId: user.id, moneyRequestId: input.moneyRequestId },
      });

      if (!prevApproval) {
        const approval = await prisma?.moneyRequestApproval.create({
          data: {
            moneyRequestId: input.moneyRequestId,
            status: 'ACCEPTED',
            accountId: user.id,
            rejectMessage: '',
          },
          include: {
            account: { select: { displayName: true } },
            moneyRequest: { select: { organizationId: true } },
          },
        });
        await reqApprovalApproved({ input: approval });
        return approval;
      }

      const approval = await prisma?.moneyRequestApproval.update({
        data: { status: 'ACCEPTED', rejectMessage: '' },
        include: {
          account: { select: { displayName: true } },
          moneyRequest: { select: { organizationId: true } },
        },
        where: { id: prevApproval.id },
      });
      await reqApprovalApproved({ input: approval });
      return approval;
    }),
  reject: adminModProcedure
    .input(z.object({ moneyRequestId: z.string(), rejectMessage: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;

      const prevApproval = await prisma?.moneyRequestApproval.findFirst({
        where: { accountId: user.id, moneyRequestId: input.moneyRequestId },
      });
      if (prevApproval) {
        const approval = await prisma?.moneyRequestApproval.update({
          data: { status: 'REJECTED', rejectMessage: input.rejectMessage },
          include: {
            account: { select: { displayName: true } },
            moneyRequest: { select: { organizationId: true } },
          },
          where: { id: prevApproval.id },
        });
        await reqApprovalRejection({ input: approval });
        return approval;
      }
      const approval = await prisma?.moneyRequestApproval.create({
        data: {
          moneyRequestId: input.moneyRequestId,
          status: 'REJECTED',
          accountId: user.id,
          rejectMessage: input.rejectMessage,
        },
        include: {
          account: { select: { displayName: true } },
          moneyRequest: { select: { organizationId: true } },
        },
      });
      await reqApprovalRejection({ input: approval });
      return approval;
    }),
});
