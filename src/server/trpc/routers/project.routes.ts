import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { validateProject } from '../../../lib/validations/project.validate';
import { adminProcedure, protectedProcedure, router } from '../initTrpc';

export const projectRouter = router({
  getMany: protectedProcedure.query(async () => {
    return await prisma?.project.findMany();
  }),
  create: protectedProcedure
    .input(validateProject)
    .mutation(async ({ input, ctx }) => {
      // console.log(input);

      if (!ctx.session.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'No user session.',
        });
      }
      // return {};
      const project = await prisma?.project.create({
        data: {
          createdById: ctx.session.user.id,
          displayName: input.displayName,
          description: input.description,
          organizationId: input.organizationId,
          allowedUsers: input.allowedUsers,
        },
      });
      return project;
    }),
  edit: protectedProcedure
    .input(validateProject)
    .mutation(async ({ input, ctx }) => {
      const project = await prisma?.project.update({
        where: { id: input.id },
        data: {
          updatedById: ctx.session.user.id,
          displayName: input.displayName,
          description: input.description,
          allowedUsers: input.allowedUsers,
        },
      });
      return project;
    }),
  deleteById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const project = await prisma?.project.delete({
        where: { id: input.id },
      });
      return project;
    }),
});
