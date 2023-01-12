import { validateImbursement } from '@/lib/validations/imbursement.validate';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
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
            projectId: input.projectId,
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
          include: { searchableImage: { select: { id: true } } },
        });

        // 2. Get latest transaction of the bank Account
        const getMoneyAccAndLatestTx = await txCtx.moneyAccount.findUnique({
          where: { id: input.moneyAccountId },
          include: { transactions: { take: 1, orderBy: { id: 'desc' } } },
        });

        //TODO check what happens when there is no previous tx
        if (!getMoneyAccAndLatestTx) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No money request or transaction.',
          });
        }
        // 3. Calculate balance based on transaction or initialbalance
        const transactionAmount = input.wasConvertedToOtherCurrency
          ? input.finalAmount
          : input.amountInOtherCurrency;
        const lastTx = getMoneyAccAndLatestTx?.transactions[0];
        const openingBalance = lastTx
          ? lastTx.currentBalance
          : getMoneyAccAndLatestTx.initialBalance;
        const currentBalance = lastTx
          ? lastTx.currentBalance.add(transactionAmount)
          : getMoneyAccAndLatestTx.initialBalance.add(transactionAmount);

        // 4. Create transaction, add values dependant of conversion
        await txCtx.transaction.create({
          data: {
            transactionAmount,
            accountId: user.id,
            currency: input.wasConvertedToOtherCurrency
              ? input.finalCurrency
              : input.otherCurrency,
            openingBalance: openingBalance,
            currentBalance: currentBalance,
            moneyAccountId: input.moneyAccountId,
            moneyRequestId: null,
            imbursementId: imbursement.id,
            expenseReturnId: null,
            searchableImage: imbursement.searchableImage?.id
              ? { connect: { id: imbursement.searchableImage?.id } }
              : {},
          },
        });
      });
    }),
  // edit executed amount when going from other than accepted
  edit: adminModProcedure
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

      if (!taxPayer || !input.searchableImage || !input.moneyAccountId) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'taxpayer failed',
        });
      }

      const updatedImbursement = await prisma?.imbursement.update({
        where: { id: input.id },
        data: {
          concept: input.concept,
          projectId: input.projectId,
          wasConvertedToOtherCurrency: input.wasConvertedToOtherCurrency,
          // exchangeRate: input.exchangeRate,
          // otherCurrency: input.otherCurrency,
          // amountInOtherCurrency: input.amountInOtherCurrency,
          // finalCurrency: input.finalCurrency,
          // finalAmount: input.finalAmount,
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
        include: {
          transaction: { select: { id: true } },
          searchableImage: { select: { id: true } },
        },
      });
      if (updatedImbursement.searchableImage?.id) {
      }
      await prisma.transaction.update({
        where: { id: updatedImbursement.transaction[0]?.id },
        data: {
          searchableImage: {
            connect: { id: updatedImbursement.searchableImage?.id },
          },
        },
      });
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

      await prisma.transaction.deleteMany({
        where: { imbursementId: input.id },
      });

      const x = await prisma?.imbursement.delete({
        where: { id: input.id },
      });
      return x;
    }),
  cancelById: adminModProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.$transaction(async (txCtx) => {
        // Create a transaction that reverses the previous one and reference the new and old one with each other.,
        const imbursement = await txCtx.imbursement.update({
          where: { id: input.id },
          data: { wasCancelled: true },
          include: { transaction: true, searchableImage: true },
        });

        const tx = imbursement.transaction[0];
        if (!tx) {
          throw new TRPCError({
            code: 'PRECONDITION_FAILED',
            message: 'transaction not found',
          });
        }

        const cancellation = await txCtx.transaction.create({
          data: {
            isCancellation: true,
            transactionAmount: tx.transactionAmount,
            accountId: tx.accountId,
            currency: tx.currency,
            openingBalance: tx.currentBalance,
            currentBalance: tx.openingBalance,
            moneyAccountId: tx.moneyAccountId,
            moneyRequestId: tx.moneyRequestId,
            imbursementId: tx.imbursementId,
            expenseReturnId: tx.expenseReturnId,
            cancellationId: tx.id,
            searchableImage: imbursement.searchableImage?.id
              ? {
                  connect: { id: imbursement.searchableImage?.id },
                }
              : {},
          },
        });

        await txCtx.transaction.update({
          where: { id: tx.id },
          data: {
            cancellationId: cancellation.id,
          },
        });

        return;
      });
    }),
});
