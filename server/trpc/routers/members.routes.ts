import {
  adminModProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from '../initTrpc';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { validateInitialSetup } from '@/lib/validations/setup.validate';
import { handleOrderBy } from './utils/Sorting.routeUtils';
import { validateAccount } from '@/lib/validations/account.validate';
import prisma from '@/server/db/client';
import { validateAccountProfile } from '@/lib/validations/profileSettings.validate';

export const membersRouter = router({
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

  findByEmail: adminModProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ input }) => {
      return await prisma?.account.findMany({
        take: 20,
        orderBy: { email: 'asc' },
        where: {
          email: {
            search: input.email,
          },
          role: 'USER',
          isVerified: true,
          active: true,
        },
        select: { displayName: true, email: true, id: true, role: true },
      });
    }),
});
