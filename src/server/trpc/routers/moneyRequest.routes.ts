import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { validateMoneyRequest } from '../../../lib/validations/moneyRequest.validate';
import {
  adminModProcedure,
  adminProcedure,
  protectedProcedure,
  router,
} from '../initTrpc';

export const moneyRequestRouter = router({
  getMany: adminModProcedure.query(async () => {
    return await prisma?.moneyRequest.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
  }),
  getManyComplete: adminModProcedure.query(async () => {
    return await prisma?.moneyRequest.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        account: true,
        project: true,
        transactions: true,
        moneyRequestApprovals: true,
        organization: {
          select: {
            moneyRequestApprovers: { select: { id: true, displayName: true } },
            moneyAdministrators: { select: { id: true, displayName: true } },
          },
        },
      },
    });
  }),
  findCompleteById: adminModProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      if (!input.id.length) return null;
      return await prisma?.moneyRequest.findUnique({
        where: { id: input.id },
        include: {
          account: true,
          project: true,
          transactions: true,
          moneyRequestApprovals: true,
          organization: {
            select: {
              moneyRequestApprovers: {
                select: { id: true, displayName: true },
              },
              moneyAdministrators: { select: { id: true, displayName: true } },
            },
          },
        },
      });
    }),
  create: protectedProcedure
    .input(validateMoneyRequest)
    .mutation(async ({ input, ctx }) => {
      const x = await prisma?.moneyRequest.create({
        data: {
          accountId: ctx.session.user.id,
          amountRequested: new Prisma.Decimal(input.amountRequested),
          currency: input.currency,
          description: input.description,
          moneyRequestType: input.moneyRequestType,
          projectId: input.projectId,
          status: input.status,
          rejectionMessage: input.rejectionMessage,
          organizationId: input.organizationId,
        },
      });
      return x;
    }),
  edit: protectedProcedure
    .input(validateMoneyRequest)
    .mutation(async ({ input }) => {
      const x = await prisma?.moneyRequest.update({
        where: { id: input.id },
        data: {
          amountRequested: new Prisma.Decimal(input.amountRequested),
          currency: input.currency,
          description: input.description,
          moneyRequestType: input.moneyRequestType,
          projectId: input.projectId,
          status: input.status,
          rejectionMessage: input.rejectionMessage,
          organizationId: input.organizationId,
        },
      });
      return x;
    }),
  deleteById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const x = await prisma?.moneyRequest.delete({
        where: { id: input.id },
      });
      return x;
    }),
});
