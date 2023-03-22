import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { validateExpenseReport } from '@/lib/validations/expenseReport.validate';
import {
  adminModObserverProcedure,
  adminProcedure,
  protectedProcedure,
  router,
} from '../initTrpc';
import prisma from '@/server/db/client';
import {
  createCostCategoryTransactions,
  createExpenseReportProof,
} from './utils/ExpenseReport.routeUtils';

export const expenseReportsRouter = router({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    return await prisma?.expenseReport.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      where: {
        accountId: user.id,
      },
    });
  }),
  count: protectedProcedure.query(async () => prisma?.expenseReport.count()),
  getMyOwnComplete: protectedProcedure
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
    .query(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const pageSize = input.pageSize ?? 10;
      const pageIndex = input.pageIndex ?? 0;

      //splits nested objects
      const handleOrderBy = () => {
        if (input.sorting && input.sorting[0]) {
          const prop = input.sorting[0];
          if (prop.id.includes('_')) {
            const split = prop.id.split('_');
            return {
              [split[0] as string]: {
                [split[1] as string]: prop.desc ? 'desc' : 'asc',
              },
            };
          }
          return { [prop.id]: prop.desc ? 'desc' : 'asc' };
        }
        return { createdAt: 'desc' } as any;
      };

      return await prisma?.expenseReport.findMany({
        where: { accountId: user.id },
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: handleOrderBy(),
        include: {
          project: { select: { displayName: true, id: true } },
          costCategory: { select: { id: true, displayName: true } },
          taxPayer: {
            select: { fantasyName: true, razonSocial: true, ruc: true },
          },
          searchableImage: { select: { url: true, imageName: true } },
        },
      });
    }),
  getManyComplete: adminModObserverProcedure
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

      //splits nested objects
      const handleOrderBy = () => {
        if (input.sorting && input.sorting[0]) {
          const prop = input.sorting[0];
          if (prop.id.includes('_')) {
            const split = prop.id.split('_');
            return {
              [split[0] as string]: {
                [split[1] as string]: prop.desc ? 'desc' : 'asc',
              },
            };
          }
          return { [prop.id]: prop.desc ? 'desc' : 'asc' };
        }
        return { createdAt: 'desc' } as any;
      };

      return await prisma?.expenseReport.findMany({
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: handleOrderBy(),
        include: {
          costCategory: { select: { id: true, displayName: true } },
          account: { select: { displayName: true, id: true } },
          project: { select: { displayName: true, id: true } },
          taxPayer: {
            select: { fantasyName: true, razonSocial: true, ruc: true },
          },
          searchableImage: { select: { url: true, imageName: true } },
        },
      });
    }),
  findCompleteById: adminModObserverProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      if (!input.id.length) return null;
      return await prisma?.moneyRequest.findUnique({
        where: { id: input.id },
        include: {
          account: true,
          project: true,
          transactions: true,
          moneyRequestApprovals: true,
          expenseReports: true,
          organization: {
            select: {
              moneyRequestApprovers: {
                select: { id: true, displayName: true },
              },
              moneyAdministrators: { select: { id: true, displayName: true } },
            },
          },
        },
      });
    }),
  create: protectedProcedure
    .input(validateExpenseReport)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      // Based on the RUC, we query the db, if no taxpayer, creates. Else do nothing. The returned value is used then to attach the taxpayerid to the expense report.
      const taxPayer = await prisma?.taxPayer.upsert({
        where: {
          ruc: input.taxPayer.ruc,
        },
        create: {
          createdById: user.id,
          razonSocial: input.taxPayer.razonSocial,
          ruc: input.taxPayer.ruc,
        },
        update: {},
      });
      if (!taxPayer || !input.searchableImage) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'taxpayer failed',
        });
      }
      const expenseReportProof = await createExpenseReportProof({ input });

      if (!expenseReportProof) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'no proof',
        });
      }
      await prisma.$transaction(async (txCtx) => {
        const expenseReport = await txCtx?.expenseReport.create({
          data: {
            accountId: user.id,
            concept: input.concept,
            facturaNumber: input.facturaNumber,
            amountSpent: input.amountSpent,
            comments: input.comments,
            currency: input.currency,
            costCategoryId: input.costCategoryId,
            moneyRequestId: input.moneyRequestId,
            taxPayerId: taxPayer.id,
            projectId: input.projectId,
            searchableImage: { connect: { id: expenseReportProof.id } },
          },
          include: {
            account: { select: { id: true } },
            searchableImage: true,
            taxPayer: true,
          },
        });
        if (!expenseReport) {
          throw new TRPCError({
            code: 'PRECONDITION_FAILED',
            message: 'taxpayer failed',
          });
        }

        await createCostCategoryTransactions({
          expenseReport,
          txCtx,
        });
      });
    }),
  edit: protectedProcedure
    .input(validateExpenseReport)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;

      const taxPayer = await prisma?.taxPayer.upsert({
        where: {
          ruc: input.taxPayer.ruc,
        },
        create: {
          createdById: user.id,
          razonSocial: input.taxPayer.razonSocial,
          ruc: input.taxPayer.ruc,
        },
        update: {},
      });
      if (!taxPayer || !input.searchableImage) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'taxpayer failed',
        });
      }

      const x = await prisma?.expenseReport.update({
        where: { id: input.id },
        data: {
          accountId: user.id,
          facturaNumber: input.facturaNumber,

          amountSpent: input.amountSpent,
          comments: input.comments,
          currency: input.currency,
          moneyRequestId: input.moneyRequestId,
          taxPayerId: taxPayer.id,
          projectId: input.projectId,
          searchableImage: {
            upsert: {
              create: {
                url: input.searchableImage.url,
                imageName: input.searchableImage.imageName,
                text: '',
              },
              update: {
                url: input.searchableImage.url,
              },
            },
          },
        },
      });

      return x;
    }),

  cancelById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const x = await prisma?.expenseReport.update({
        where: { id: input.id },
        data: { wasCancelled: true },
      });
      return x;
    }),
  deleteById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const x = await prisma?.expenseReport.delete({
        where: { id: input.id },
      });
      return x;
    }),
});
