import { z } from 'zod';
import { validateTaxPayer } from '../../../lib/validations/taxtPayer.validate';
import {
  adminProcedure,
  adminModProcedure,
  router,
  protectedProcedure,
} from '../initTrpc';
import { handleOrderBy } from './utils/SortingUtils';

export const taxPayerRouter = router({
  count: adminModProcedure.query(async () => {
    return await prisma?.taxPayer.count();
  }),
  getMany: adminModProcedure
    .input(
      z.object({
        pageIndex: z.number().nullish(),
        pageSize: z.number().min(1).max(100).nullish(),
        sorting: z
          .object({ id: z.string(), desc: z.boolean() })
          .array()
          .nullish(),
      })
    )
    .query(async ({ input }) => {
      const pageSize = input.pageSize ?? 10;
      const pageIndex = input.pageIndex ?? 0;

      return await prisma?.taxPayer.findMany({
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: handleOrderBy({ input }),
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
    .input(validateTaxPayer)
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
    .input(validateTaxPayer)
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
