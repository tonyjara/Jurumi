import { validateImbursement } from '@/lib/validations/imbursement.validate';
import { MoneyResquestApprovalStatus, Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { validateMoneyRequest } from '../../../lib/validations/moneyRequest.validate';
import { adminProcedure, adminModProcedure, router } from '../initTrpc';
import { handleOrderBy } from './utils/SortingUtils';
import prisma from '@/server/db/client';

export const imbursementsRouter = router({
  getMany: adminModProcedure.query(async () => {
    return await prisma?.moneyRequest.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
  }),
  getMyOwnComplete: adminModProcedure
    .input(
      z.object({
        status: z.nativeEnum(MoneyResquestApprovalStatus).optional(),
        pageIndex: z.number().nullish(),
        pageSize: z.number().min(1).max(100).nullish(),
        sorting: z
          .object({ id: z.string(), desc: z.boolean() })
          .array()
          .nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const pageSize = input.pageSize ?? 10;
      const pageIndex = input.pageIndex ?? 0;

      return await prisma?.moneyRequest.findMany({
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: handleOrderBy({ input }),
        include: {
          project: true,
          costCategory: true,
          transactions: true,
          expenseReports: true,
        },

        where: { accountId: user.id, status: input.status },
      });
    }),
  count: adminModProcedure.query(async () => prisma?.moneyRequest.count()),

  create: adminModProcedure
    .input(validateImbursement)
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

      return await prisma?.imbursement.create({
        data: {
          createdById: user.id,
          concept: input.concept,
          wasConvertedToOtherCurrency: input.wasConvertedToOtherCurrency,
          exchangeRate: input.exchangeRate,
          otherCurrency: input.otherCurrency,
          amountInOtherCurrency: input.amountInOtherCurrency,
          finalCurrency: input.finalCurrency,
          finalAmount: input.finalAmount,
          projectStageId: input.projectStageId,
          moneyAccountId: input.moneyAccountId,
          taxPayerId: taxPayer.id,
          searchableImage: {
            create: {
              url: input.searchableImage.url,
              imageName: input.searchableImage.imageName,
              text: '',
            },
          },
        },
      });
    }),
  // edit executed amount when going from other than accepted
  edit: adminModProcedure
    .input(validateMoneyRequest)
    .mutation(async ({ input }) => {
      const x = await prisma?.moneyRequest.update({
        where: { id: input.id },
        data: {
          amountRequested: new Prisma.Decimal(input.amountRequested),
          currency: input.currency,
          description: input.description,
          moneyRequestType: input.moneyRequestType,
          projectId: input.projectId,
          status: input.status,
          rejectionMessage: input.rejectionMessage,
          organizationId: input.organizationId,
          costCategoryId: input.costCategoryId,
        },
      });
      return x;
    }),
  //TODO substract from costcategory if it was accepted
  deleteById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const x = await prisma?.moneyRequest.delete({
        where: { id: input.id },
      });
      return x;
    }),
});
