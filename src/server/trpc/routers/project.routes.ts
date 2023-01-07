import type { CostCategory } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { validateProject } from '../../../lib/validations/project.validate';
import { adminProcedure, protectedProcedure, router } from '../initTrpc';

export const projectRouter = router({
  getMany: protectedProcedure.query(async () => {
    return await prisma?.project.findMany({
      include: { costCategories: true, projectStages: true },
    });
  }),
  getCostCatsForProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      return await prisma?.costCategory.findMany({
        where: { projectId: input.projectId },
      });
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

      const mappedCategories = input.costCategories.map(
        (cat) =>
          ({
            displayName: cat.displayName,
            openingBalance: cat.openingBalance,
            executedAmount: cat.executedAmount,
            createdById: ctx.session.user.id,
            currency: cat.currency,
          } as CostCategory)
      );

      const project = await prisma?.project.create({
        data: {
          createdById: ctx.session.user.id,
          displayName: input.displayName,
          description: input.description,
          organizationId: input.organizationId,
          costCategories: { createMany: { data: mappedCategories } },
        },
      });
      return project;
    }),
  edit: protectedProcedure
    .input(validateProject)
    .mutation(async ({ input, ctx }) => {
      //update cost categories

      input.costCategories.map(
        async (cat) =>
          await prisma?.costCategory.upsert({
            create: {
              displayName: cat.displayName,
              openingBalance: cat.openingBalance,
              executedAmount: cat.executedAmount,
              createdById: ctx.session.user.id,
              currency: cat.currency,
              projectId: input.id,
            },
            update: {
              displayName: cat.displayName,
              openingBalance: cat.openingBalance,
              executedAmount: cat.executedAmount,
              createdById: ctx.session.user.id,
              currency: cat.currency,
            },
            where: { id: cat.id },
          })
      );

      const project = await prisma?.project.update({
        where: { id: input.id },
        data: {
          updatedById: ctx.session.user.id,
          displayName: input.displayName,
          description: input.description,
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
