import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { validateMoneyRequest } from '../../../lib/validations/moneyRequest.validate';
import { adminProcedure, protectedProcedure, router } from '../initTrpc';

export const moneyRequestRouter = router({
  getMany: protectedProcedure.query(async () => {
    return await prisma?.moneyRequest.findMany();
  }),
  create: protectedProcedure
    .input(validateMoneyRequest)
    .mutation(async ({ input, ctx }) => {
      // console.log(input);

      if (!ctx.session.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'No user session.',
        });
      }
      // return {};
      const x = await prisma?.moneyRequest.create({
        data: {
          accountId: ctx.session.user.id,
          amountRequested: new Prisma.Decimal(input.amountRequested),
          currency: input.currency,
          description: input.description,
          moneyRequestType: input.moneyRequestType,
          fundSentPictureUrl: input.fundSentPictureUrl,
          projectId: input.projectId,
          moneyAccountId: input.moneyAccountId,
          status: input.status,
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
          fundSentPictureUrl: input.fundSentPictureUrl,
          projectId: input.projectId,
          moneyAccountId: input.moneyAccountId,
          status: input.status,
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
