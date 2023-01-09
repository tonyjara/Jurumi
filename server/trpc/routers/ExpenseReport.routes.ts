import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { validateExpenseReport } from '../../../lib/validations/expenseReport.validate';
import {
  adminModProcedure,
  adminProcedure,
  protectedProcedure,
  router,
} from '../initTrpc';
import prisma from '@/server/db/client';

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
  getManyComplete: protectedProcedure
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
          CostCategory: { select: { displayName: true, id: true } },
          Project: { select: { displayName: true, id: true } },
          taxPayer: {
            select: { fantasyName: true, razonSocial: true, ruc: true },
          },
          searchableImage: { select: { url: true, imageName: true } },
        },
      });
    }),
  findCompleteById: adminModProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      if (!input.id.length) return null;
      return await prisma?.moneyRequest.findUnique({
        where: { id: input.id },
        include: {
          account: true,
          project: true,
          costCategory: true,
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

      const x = await prisma?.expenseReport.create({
        data: {
          accountId: user.id,
          facturaNumber: input.facturaNumber,

          amountSpent: input.amountSpent,
          comments: input.comments,
          currency: input.currency,
          moneyRequestId: input.moneyRequestId,
          taxPayerId: taxPayer.id,
          projectId: input.projectId,
          costCategoryId: input.costCategoryId,

          searchableImage: {
            create: {
              url: input.searchableImage.url,
              imageName: input.searchableImage.imageName,
              text: '',
            },
          },
        },
      });

      return x;
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
          costCategoryId: input.costCategoryId,
          projectId: input.projectId,
          // searchableImage: {
          //   create: {
          //     url: input.facturaPictureUrl,
          //     imageName: input.imageName,
          //     text: '',
          //   },
          // },
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
