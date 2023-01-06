import {
  adminModProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from '../initTrpc';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { validateInitialSetup } from '../../../lib/validations/setup.validate';
import { handleOrderBy } from './utils/SortingUtils';
import { validateAccount } from '../../../lib/validations/account.validate';

export const accountsRouter = router({
  toggleActivation: adminModProcedure
    .input(z.object({ id: z.string(), active: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'No user session.',
        });
      }
      return await prisma?.account.update({
        where: {
          id: input.id,
        },
        data: { active: input.active },
      });
    }),
  count: protectedProcedure.query(async () => {
    return await prisma?.account.count();
  }),
  getUnique: protectedProcedure.query(async ({ ctx }) => {
    return await prisma?.account.findUnique({
      where: {
        email: ctx.session.user.email,
      },
    });
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

      return await prisma?.account.findMany({
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: handleOrderBy({ input }),
      });
    }),
  getAllActive: adminModProcedure.query(async () => {
    //Use this to build options with react-select
    return await prisma?.account.findMany({
      where: { active: true },
      orderBy: { displayName: 'asc' },
      select: { id: true, displayName: true, email: true },
    });
  }),
  //It's only used for initial setup
  createOneUNSAFE: publicProcedure
    .input(validateInitialSetup)
    .mutation(async ({ input }) => {
      const accounts = await prisma?.account.findMany();
      if (accounts?.length) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Only allowed when no accounts.',
        });
      }

      const hashedPass = await bcrypt.hash(input.password, 10);

      return await prisma?.account.create({
        data: {
          displayName: input.displayName,
          email: input.email,
          role: 'ADMIN',
          isVerified: true,
          active: true,
          password: hashedPass,
        },
      });
    }),
  edit: adminModProcedure
    .input(validateAccount)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      if (input.role === 'ADMIN' && user.role !== 'ADMIN') {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Only admins can create admins.',
        });
      }
      return await prisma?.account.update({
        where: { id: input.id },
        data: {
          displayName: input.displayName,
          email: input.email,
          role: input.role,
        },
      });
    }),
});
