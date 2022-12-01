import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { validateDisbursement } from '../../../lib/validations/disbursement.validate';
import { adminProcedure, protectedProcedure, router } from '../initTrpc';

export const disbursementRouter = router({
  getMany: protectedProcedure.query(async () => {
    return await prisma?.disbursement.findMany();
  }),
  create: protectedProcedure
    .input(validateDisbursement)
    .mutation(async ({ input, ctx }) => {
      // console.log(input);

      if (!ctx.session.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'No user session.',
        });
      }
      // return {};
      const x = await prisma?.disbursement.create({
        data: {
          accountId: ctx.session.user.id,
          amount: new Prisma.Decimal(input.amount),
          bankId: input.bankId,
          createdById: ctx.session.user.id,
          currency: input.currency,
          description: input.description,
          disbursementType: input.disbursementType,
          facturaNumber: input.facturaNumber,
          pictureUrl: input.pictureUrl,
          projectId: input.projectId,
          scannedText: input.scannedText,
          status: input.status,
        },
      });
      return x;
    }),
  edit: protectedProcedure
    .input(validateDisbursement)
    .mutation(async ({ input, ctx }) => {
      const x = await prisma?.disbursement.update({
        where: { id: input.id },
        data: {
          accountId: ctx.session.user.id,
          amount: new Prisma.Decimal(input.amount),
          bankId: input.bankId,
          updatedById: ctx.session.user.id,
          currency: input.currency,
          description: input.description,
          disbursementType: input.disbursementType,
          facturaNumber: input.facturaNumber,
          pictureUrl: input.pictureUrl,
          projectId: input.projectId,
          scannedText: input.scannedText,
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
      const x = await prisma?.disbursement.delete({
        where: { id: input.id },
      });
      return x;
    }),
});
