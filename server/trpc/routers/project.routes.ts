import type { CostCategory } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { validateProject } from '../../../lib/validations/project.validate';
import {
  adminModProcedure,
  adminProcedure,
  protectedProcedure,
  router,
} from '../initTrpc';
import prisma from '@/server/db/client';

export const projectRouter = router({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const isModOrAdmin = user.role !== 'USER';
    console.log(isModOrAdmin);

    return await prisma?.project.findMany({
      include: {
        costCategories: true,
        allowedUsers: {
          where: {
            role: 'USER',
            isVerified: true,
            active: true,
            //if user is not admin or mod only return projects which user is member off.
          },
          select: { displayName: true, email: true, id: true },
        },
      },
      where: { allowedUsers: !isModOrAdmin ? { some: { id: user.id } } : {} },
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
          endDate: input.endDate,
          projectType: input.projectType,
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
              createdById: ctx.session.user.id,
              currency: cat.currency,
              projectId: input.id,
            },
            update: {
              displayName: cat.displayName,
              openingBalance: cat.openingBalance,
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
          endDate: input.endDate,
          projectType: input.projectType,
        },
      });
      return project;
    }),
  addAccountToProject: adminModProcedure
    .input(
      z.object({
        accountId: z.string(),
        projectId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Throw if user doesn't exist, is not verified or not active
      await prisma.account.findFirstOrThrow({
        where: { id: input.accountId, isVerified: true, active: true },
      });

      return await prisma.project.update({
        where: { id: input.projectId },
        data: { allowedUsers: { connect: { id: input.accountId } } },
      });
    }),
  removeAccountFromProject: adminModProcedure
    .input(
      z.object({
        accountId: z.string(),
        projectId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Throw if user doesn't exist, is not verified or not active
      await prisma.account.findFirstOrThrow({
        where: { id: input.accountId, isVerified: true, active: true },
      });

      return await prisma.project.update({
        where: { id: input.projectId },
        data: { allowedUsers: { disconnect: { id: input.accountId } } },
      });
    }),
  deleteById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.costCategory.deleteMany({ where: { projectId: input.id } });

      const project = await prisma?.project.delete({
        where: { id: input.id },
      });
      return project;
    }),
});
