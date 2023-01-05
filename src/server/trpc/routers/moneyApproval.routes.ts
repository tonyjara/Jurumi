import { z } from 'zod';
import { adminModProcedure, router } from '../initTrpc';

export const moneyApprovalRouter = router({
  approve: adminModProcedure
    .input(z.object({ moneyRequestId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;

      const prevApproval = await prisma?.moneyRequestApproval.findFirst({
        where: { accountId: user.id, moneyRequestId: input.moneyRequestId },
      });

      if (!prevApproval) {
        return await prisma?.moneyRequestApproval.create({
          data: {
            moneyRequestId: input.moneyRequestId,
            status: 'ACCEPTED',
            accountId: user.id,
            rejectMessage: '',
          },
        });
      }

      return await prisma?.moneyRequestApproval.update({
        data: { status: 'ACCEPTED', rejectMessage: '' },
        where: { id: prevApproval.id },
      });
    }),
  reject: adminModProcedure
    .input(z.object({ moneyRequestId: z.string(), rejectMessage: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;

      const prevApproval = await prisma?.moneyRequestApproval.findFirst({
        where: { accountId: user.id, moneyRequestId: input.moneyRequestId },
      });
      if (prevApproval) {
        return await prisma?.moneyRequestApproval.update({
          data: { status: 'REJECTED', rejectMessage: input.rejectMessage },
          where: { id: prevApproval.id },
        });
      }
      return await prisma?.moneyRequestApproval.create({
        data: {
          moneyRequestId: input.moneyRequestId,
          status: 'REJECTED',
          accountId: user.id,
          rejectMessage: input.rejectMessage,
        },
      });
    }),
});
