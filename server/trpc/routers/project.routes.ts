import type { CostCategory } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { validateProject } from "@/lib/validations/project.validate";
import {
  adminModObserverProcedure,
  adminModProcedure,
  adminProcedure,
  protectedProcedure,
  router,
} from "../initTrpc";
import prisma from "@/server/db/client";
import { handleOrderBy } from "./utils/Sorting.routeUtils";
import { accountIsPartOfProjectBrowserNotifications } from "./notifications/browser/accountIsPartOfProject.notifications.browser";
import { accountIsPartOfProjectDbNotification } from "./notifications/db/accountIsPartOfProject.notifications.db";
import { completeTransactionsArgs } from "@/pageContainers/mod/transactions/transactions.types";
import { completeProjectArgs } from "@/pageContainers/mod/projects/project.types";

export const projectRouter = router({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const isModOrAdmin = user.role !== "USER";

    return await prisma?.project.findMany({
      include: {
        costCategories: true,
        allowedUsers: {
          take: 20,
          where: {
            role: "USER",
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
  getManyForTable: adminModObserverProcedure
    .input(
      z.object({
        sorting: z
          .object({ id: z.string(), desc: z.boolean() })
          .array()
          .nullish(),
      }),
    )
    .query(async ({ input }) => {
      return await prisma?.project.findMany({
        orderBy: handleOrderBy({ input }),
        ...completeProjectArgs,
      });
    }),

  getLastProjectTransaction: adminModObserverProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.projectId) return null;

      return await prisma?.project.findUnique({
        where: { id: input.projectId },
        include: {
          transactions: {
            where: {
              projectId: input.projectId,
              transactionType: "PROJECT_IMBURSEMENT",
              isCancellation: false,
            },
            take: 1,
            orderBy: { id: "desc" },
            select: { currentBalance: true, currency: true },
          },
        },
      });
    }),
  getProjectTransactions: adminModObserverProcedure
    .input(
      z.object({
        pageIndex: z.number().nullish(),
        pageSize: z.number().min(1).max(100).nullish(),
        sorting: z
          .object({ id: z.string(), desc: z.boolean() })
          .array()
          .nullish(),
        projectId: z.string().optional(),
      }),
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
            ...completeTransactionsArgs,
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
          code: "UNAUTHORIZED",
          message: "No user session.",
        });
      }

      const mappedCategories = input.costCategories.map(
        (cat) =>
          ({
            displayName: cat.displayName,
            assignedAmount: cat.assignedAmount,
            createdById: ctx.session.user.id,
            currency: cat.currency,
            referenceExchangeRate: cat.referenceExchangeRate,
          }) as CostCategory,
      );

      const project = await prisma?.project.create({
        data: {
          acronym: input.acronym,
          createdById: ctx.session.user.id,
          financerName: input.financerName,
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
              referenceExchangeRate: cat.referenceExchangeRate,
            },
            update: {
              displayName: cat.displayName,
              assignedAmount: cat.assignedAmount,
              referenceExchangeRate: cat.referenceExchangeRate,
              createdById: ctx.session.user.id,
              currency: cat.currency,
            },
            where: { id: cat.id },
          }),
      );

      const project = await prisma?.project.update({
        where: { id: input.id },
        data: {
          acronym: input.acronym,
          updatedById: ctx.session.user.id,
          financerName: input.financerName,
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
      }),
    )
    .mutation(async ({ input }) => {
      await prisma.$transaction(async (txCtx) => {
        // Throw if user doesn't exist, is not verified or not active
        await txCtx.account.findFirstOrThrow({
          where: { id: input.accountId, isVerified: true, active: true },
        });

        const project = await txCtx.project.update({
          where: { id: input.projectId },
          data: { allowedUsers: { connect: { id: input.accountId } } },
        });

        await accountIsPartOfProjectDbNotification({
          accountId: input.accountId,
          project,
          txCtx,
        });
        await accountIsPartOfProjectBrowserNotifications({
          accountId: input.accountId,
          project,
          txCtx,
        });

        return project;
      });
    }),
  removeAccountFromProject: adminModProcedure
    .input(
      z.object({
        accountId: z.string(),
        projectId: z.string(),
      }),
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
      }),
    )
    .mutation(async ({ input }) => {
      await prisma.costCategory.deleteMany({ where: { projectId: input.id } });

      const project = await prisma?.project.delete({
        where: { id: input.id },
      });
      return project;
    }),
  getAllOrgProjects: adminModObserverProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const preferences = await prisma?.preferences.findFirstOrThrow({
      where: { accountId: user?.id },
    });

    return await prisma?.project.findMany({
      where: { organizationId: preferences?.selectedOrganization },
      select: {
        id: true,
        displayName: true,
      },
    });
  }),
  getAllOrgCostCategories: adminModObserverProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const preferences = await prisma?.preferences.findFirstOrThrow({
      where: { accountId: user?.id },
    });

    return await prisma?.project.findMany({
      where: { organizationId: preferences?.selectedOrganization },
      select: {
        costCategories: { select: { id: true, displayName: true } },
      },
    });
  }),
});
