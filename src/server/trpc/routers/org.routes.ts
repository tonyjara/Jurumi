import type { Account } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { validateOrgCreate } from '../../../lib/validations/org.create.validate';
import { validateOrgEdit } from '../../../lib/validations/org.edit.validate';
import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from '../initTrpc';

export const orgRouter = router({
  getMany: protectedProcedure.query(async () => {
    return await prisma?.organization.findMany();
  }),
  create: protectedProcedure
    .input(validateOrgCreate)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user as Account | undefined;
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'No user session.',
        });
      }
      const org = await prisma?.organization.create({
        data: {
          createdById: user.id,
          displayName: input.displayName,
        },
      });
      return org;
    }),
  edit: protectedProcedure
    .input(validateOrgEdit)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user as Account | undefined;

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'No user session.',
        });
      }
      const org = await prisma?.organization.update({
        where: { id: input.id },
        data: {
          displayName: input.displayName,
          updatedById: user.id,
        },
      });
      return org;
    }),
  deleteById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const org = await prisma?.organization.delete({
        where: { id: input.id },
      });
      return org;
    }),
});
