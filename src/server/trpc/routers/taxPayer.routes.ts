import { z } from 'zod';
import { taxPayerValidate } from '../../../lib/validations/taxtPayer.validate';
import {
  adminProcedure,
  adminModProcedure,
  router,
  protectedProcedure,
} from '../initTrpc';

export const taxPayerRouter = router({
  getMany: adminModProcedure.query(async () => {
    return await prisma?.taxPayer.findMany({
      take: 20,
      orderBy: { razonSocial: 'asc' },
    });
  }),
  findFirst: adminModProcedure
    .input(z.object({ ruc: z.string() }))
    .query(async () => {
      return await prisma?.taxPayer.findFirst({
        take: 20,
        orderBy: { razonSocial: 'asc' },
        where: {},
      });
    }),

  create: protectedProcedure
    .input(taxPayerValidate)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;

      const x = await prisma?.taxPayer.create({
        data: {
          createdById: user.id,
          razonSocial: input.razonSocial,
          ruc: input.ruc,
          fantasyName: input.fantasyName,
        },
      });
      return x;
    }),
  edit: protectedProcedure
    .input(taxPayerValidate)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;

      const x = await prisma?.taxPayer.update({
        where: { id: input.id },
        data: {
          updatedById: user.id,
          razonSocial: input.razonSocial,
          ruc: input.ruc,
          fantasyName: input.fantasyName,
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
      const org = await prisma?.taxPayer.delete({
        where: { id: input.id },
      });
      return org;
    }),
});
