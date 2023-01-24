import type { CostCategory } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { validateProject } from '@/lib/validations/project.validate';
import {
  adminModProcedure,
  adminProcedure,
  protectedProcedure,
  router,
} from '../initTrpc';
import prisma from '@/server/db/client';
import { handleOrderBy } from './utils/SortingUtils';

export const projectRouter = router({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const isModOrAdmin = user.role !== 'USER';

    return await prisma?.project.findMany({
      include: {
        costCategories: true,
        allowedUsers: {
          take: 20,
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
  getManyForTable: adminModProcedure
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
      return await prisma?.project.findMany({
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: handleOrderBy({ input }),
        include: {
          _count: { select: { allowedUsers: true } },
          costCategories: {
            include: {
              transactions: {
                where: { transactionType: 'COST_CATEGORY' },
                take: 1,
                orderBy: { id: 'desc' },
                select: {
                  openingBalance: true,
                  currency: true,
                  currentBalance: true,
                  transactionAmount: true,
                },
              },
            },
          },
          transactions: {
            where: { transactionType: 'PROJECT_IMBURSEMENT' },
            take: 1,
            orderBy: { id: 'desc' },
            select: {
              openingBalance: true,
              currency: true,
              currentBalance: true,
              transactionAmount: true,
            },
          },
          allowedUsers: {
            take: 20,
            where: { role: 'USER', active: true, isVerified: true },
            select: { id: true, displayName: true, email: true },
          },
        },
      });
    }),

  getLastProjectTransaction: adminModProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      if (!input.projectId) return null;

      return await prisma?.project.findUnique({
        where: { id: input.projectId },
        include: {
          transactions: {
            where: {
              projectId: input.projectId,
              transactionType: 'PROJECT_IMBURSEMENT',
            },
            take: 1,
            orderBy: { id: 'desc' },
            select: { currentBalance: true, currency: true },
          },
        },
      });
    }),
  getProjectTransactions: adminModProcedure
    .input(
      z.object({
        pageIndex: z.number().nullish(),
        pageSize: z.number().min(1).max(100).nullish(),
        sorting: z
          .object({ id: z.string(), desc: z.boolean() })
          .array()
          .nullish(),
        projectId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      if (!input.projectId) return;
      const pageSize = input.pageSize ?? 10;
      const pageIndex = input.pageIndex ?? 0;

      return await prisma?.project.findUnique({
        where: { id: input.projectId },
        include: {
          _count: { select: { transactions: true } },

          transactions: {
            take: pageSize,
            skip: pageIndex * pageSize,
            orderBy: handleOrderBy({ input }),
            include: {
              account: { select: { displayName: true } },
              moneyAccount: { select: { displayName: true } },
              moneyRequest: { select: { description: true } },
              imbursement: { select: { concept: true } },
              searchableImage: {
                select: { id: true, url: true, imageName: true },
              },
            },
          },
        },
      });
    }),
  count: protectedProcedure.query(async () => prisma?.project.count()),

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
            assignedAmount: cat.assignedAmount,
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
              assignedAmount: cat.assignedAmount,
              createdById: ctx.session.user.id,
              currency: cat.currency,
              projectId: input.id,
            },
            update: {
              displayName: cat.displayName,
              assignedAmount: cat.assignedAmount,
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
