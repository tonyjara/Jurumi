import { validateImbursement } from '@/lib/validations/imbursement.validate';
import { Prisma } from '@prisma/client';
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
  getManyComplete: adminModProcedure
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

      return await prisma?.imbursement.findMany({
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: handleOrderBy({ input }),
        include: {
          transaction: { select: { id: true } },
          taxPayer: { select: { razonSocial: true, ruc: true, id: true } },
          project: { select: { id: true, displayName: true } },
          projectStage: { select: { id: true, displayName: true } },
          searchableImage: { select: { imageName: true, url: true } },
          moneyAccount: { select: { displayName: true } },
          account: { select: { id: true, displayName: true } },
        },
      });
    }),
  count: adminModProcedure.query(async () => prisma?.imbursement.count()),

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
      return await prisma?.$transaction(async (txCtx) => {
        if (!taxPayer || !input.searchableImage || !input.moneyAccountId) {
          throw new TRPCError({
            code: 'PRECONDITION_FAILED',
            message: 'taxpayer failed',
          });
        }

        // 1. Create imbursement
        const imbursement = await txCtx?.imbursement.create({
          data: {
            accountId: user.id,
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

        // 2. Get latest transaction of the bank Account
        const getLatestTx = await txCtx.moneyAccount.findUnique({
          where: { id: input.moneyAccountId },
          include: { transactions: { take: 1, orderBy: { id: 'desc' } } },
        });
        //TODO check what happens when there is no previous tx
        if (!getLatestTx) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No money request or transaction.',
          });
        }
        // 3. Calculate balance based on transaction
        const lastTx = getLatestTx?.transactions[0];
        const currentBalance = lastTx
          ? lastTx.openingBalance.sub(lastTx.transactionAmount)
          : getLatestTx.initialBalance;

        // 4. Create transaction
        await txCtx.transaction.create({
          data: {
            transactionAmount: input.finalAmount,
            accountId: user.id,
            currency: input.finalCurrency,
            openingBalance: currentBalance,
            moneyAccountId: input.moneyAccountId,
            moneyRequestId: null,
            imbursementId: imbursement.id,
            expenseReturnId: null,
          },
        });
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
      //TODO check if it can be deleted
      const x = await prisma?.imbursement.delete({
        where: { id: input.id },
      });
      return x;
    }),
});
