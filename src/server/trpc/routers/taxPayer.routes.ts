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
  findFullTextSearch: adminModProcedure
    .input(z.object({ ruc: z.string() }))
    .query(async ({ input }) => {
      return await prisma?.taxPayer.findMany({
        take: 20,
        orderBy: { razonSocial: 'asc' },
        where: {
          ruc: {
            search: input.ruc,
          },
        },
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
  createIfNotExist: protectedProcedure
    .input(z.object({ razonSocial: z.string(), ruc: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;

      const x = await prisma?.taxPayer.upsert({
        where: {
          ruc: input.ruc,
        },
        create: {
          createdById: user.id,
          razonSocial: input.razonSocial,
          ruc: input.ruc,
        },
        update: {},
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
