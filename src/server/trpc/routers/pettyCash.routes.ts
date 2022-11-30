import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { validatePettyCash } from '../../../lib/validations/pettyCash.validate';
import { adminProcedure, protectedProcedure, router } from '../initTrpc';

export const pettyCashRouter = router({
  getMany: protectedProcedure.query(async () => {
    return await prisma?.pettyCash.findMany();
  }),
  create: protectedProcedure
    .input(validatePettyCash)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'No user session.',
        });
      }
      // return {};
      const bankAcc = await prisma?.pettyCash.create({
        data: {
          createdById: ctx.session.user.id,
          displayName: input.displayName,
          amount: new Prisma.Decimal(input.amount),
          currency: input.currency,
        },
      });
      return bankAcc;
    }),
  edit: protectedProcedure
    .input(validatePettyCash)
    .mutation(async ({ input, ctx }) => {
      const bankAcc = await prisma?.pettyCash.update({
        where: { id: input.id },
        data: {
          updatedById: ctx.session.user.id,
          displayName: input.displayName,
          amount: new Prisma.Decimal(input.amount),
          currency: input.currency,
        },
      });
      return bankAcc;
    }),
  deleteById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const BankAcc = await prisma?.pettyCash.delete({
        where: { id: input.id },
      });
      return BankAcc;
    }),
});
