import type { CostCategory, ProjectStage } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { validateProject } from '../../../lib/validations/project.validate';
import { adminProcedure, protectedProcedure, router } from '../initTrpc';
import prisma from '@/server/db/client';

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
  getProjectStages: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      return await prisma?.projectStage.findMany({
        where: { projectId: input.projectId },
      });
    }),

  create: protectedProcedure
    .input(validateProject)
    .mutation(async ({ input, ctx }) => {
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
      const mappedProjectStages = input.projectStages.map(
        (stage) =>
          ({
            displayName: stage.displayName,
            expectedFunds: stage.expectedFunds,
            createdById: ctx.session.user.id,
            startDate: stage.startDate,
            endDate: stage.endDate,
            currency: stage.currency,
          } as ProjectStage)
      );

      const project = await prisma?.project.create({
        data: {
          createdById: ctx.session.user.id,
          displayName: input.displayName,
          description: input.description,
          organizationId: input.organizationId,
          costCategories: { createMany: { data: mappedCategories } },
          projectStages: { createMany: { data: mappedProjectStages } },
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
      input.projectStages.map(
        async (stage) =>
          await prisma?.projectStage.upsert({
            create: {
              displayName: stage.displayName,
              expectedFunds: stage.expectedFunds,
              createdById: ctx.session.user.id,
              startDate: stage.startDate,
              endDate: stage.endDate,
              currency: stage.currency,
            },
            update: {
              displayName: stage.displayName,
              expectedFunds: stage.expectedFunds,
              updatedById: ctx.session.user.id,
              startDate: stage.startDate,
              endDate: stage.endDate,
              currency: stage.currency,
            },
            where: { id: stage.id },
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
      await prisma.costCategory.deleteMany({ where: { projectId: input.id } });
      await prisma.projectStage.deleteMany({ where: { projectId: input.id } });

      const project = await prisma?.project.delete({
        where: { id: input.id },
      });
      return project;
    }),
});
