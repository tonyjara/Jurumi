import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { validateExpenseReport } from '../../../lib/validations/expenseReport.validate';
import {
  adminModProcedure,
  adminProcedure,
  protectedProcedure,
  router,
} from '../initTrpc';

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

  getManyComplete: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    if (!user) return;

    return await prisma?.expenseReport.findMany({
      where: { accountId: user.id },
      take: 20,
      orderBy: { createdAt: 'desc' },
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

      const taxPayer = await prisma?.taxPayer.upsert({
        where: {
          ruc: input.taxPayerRuc,
        },
        create: {
          createdById: user.id,
          razonSocial: input.taxPayerRazonSocial,
          ruc: input.taxPayerRuc,
        },
        update: {},
      });
      if (!taxPayer) {
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
          searchableImage: {
            create: {
              url: input.facturaPictureUrl,
              imageName: input.imageName,
              text: '',
            },
          },
          //should substract on accpectance
          costCategoryId: input.costCategoryId,
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
          ruc: input.taxPayerRuc,
        },
        create: {
          createdById: user.id,
          razonSocial: input.taxPayerRazonSocial,
          ruc: input.taxPayerRuc,
        },
        update: {},
      });
      if (!taxPayer) {
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
          searchableImage: {
            create: {
              url: input.facturaPictureUrl,
              imageName: input.imageName,
              text: '',
            },
          },
          //should substract on accpectance
          costCategoryId: input.costCategoryId,
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
