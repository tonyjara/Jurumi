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
  getUnique: protectedProcedure.query(async ({ ctx }) => {
    return await prisma?.account.findUnique({
      where: {
        email: ctx.session.user.email,
      },
    });
  }),

  getMany: adminModProcedure.query(async () => {
    return await prisma?.account.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
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
});
