import { z } from 'zod';
import { validateTransactionCreate } from '@/lib/validations/transaction.create.validate';
import { validateTransactionEdit } from '@/lib/validations/transaction.edit.validate';
import { adminModProcedure, adminProcedure, router } from '../initTrpc';
import { handleOrderBy } from './utils/SortingUtils';
import {
  checkIfIsLastTransaction,
  checkIfUserIsMoneyAdmin,
  createManyMoneyAccountTransactions,
} from './utils/TransactionRouteUtils';
import prisma from '@/server/db/client';

export const transactionsRouter = router({
  getMany: adminModProcedure.query(async () => {
    return await prisma?.transaction.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
  }),
  count: adminModProcedure.query(async () => {
    return await prisma?.transaction.count();
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
      return await prisma?.transaction.findMany({
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: handleOrderBy({ input }),
        include: {
          moneyAccount: true,
          account: true,
          moneyRequest: true,
          imbursement: true,
          expenseReturn: true,
          searchableImage: { select: { id: true, url: true, imageName: true } },
        },
      });
    }),
  findManyCompleteById: adminModProcedure
    .input(z.object({ ids: z.number().array() }))
    .query(async ({ input }) => {
      if (!input.ids.length) return null;
      return await prisma?.transaction.findMany({
        where: { id: { in: input.ids } },
        include: {
          moneyAccount: true,
          account: true,
          moneyRequest: true,
          imbursement: true,
          expenseReturn: true,
          searchableImage: { select: { id: true, url: true, imageName: true } },
        },
      });
    }),

  createMany: adminModProcedure
    .input(validateTransactionCreate)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      //1. Check money admin permissions
      await checkIfUserIsMoneyAdmin(user);
      //2. Create transactions
      const x = await createManyMoneyAccountTransactions({
        accountId: ctx.session.user.id,
        formTransaction: input,
      });

      if (input.moneyRequestId && x) {
        //3. Change request status
        await prisma?.moneyRequest.update({
          where: { id: input.moneyRequestId },
          data: { status: 'ACCEPTED' },
        });
        //3. Substract from cost categories
        // if (!moneyRequest || !moneyRequest.costCategoryId) return;
        // const costCat = await prisma?.costCategory.findUnique({
        //   where: { id: moneyRequest.costCategoryId },
        // });
        // if (!costCat) return;

        //   await prisma?.costCategory.update({
        //     where: { id: moneyRequest?.costCategoryId },
        //     data: {
        //       executedAmount: costCat.executedAmount.add(
        //         reduceTransactionFields(input.transactions)
        //       ),
        //     },
        //   });
      }
      return x;
    }),
  edit: adminModProcedure
    .input(validateTransactionEdit)
    .mutation(async ({ input, ctx }) => {
      const x = await prisma?.transaction.update({
        where: { id: input.id },
        data: {
          updatedById: ctx.session.user.id,
          currency: input.currency,
          openingBalance: input.openingBalance,
          transactionAmount: input.transactionAmount,
          moneyAccountId: input.moneyAccountId,
          moneyRequestId: input.moneyRequestId,
          imbursementId: input.imbursementId,
          expenseReturnId: input.expenseReturnId,
          searchableImage: input.searchableImage
            ? {
                create: {
                  url: input.searchableImage.url,
                  imageName: input.searchableImage.imageName,
                  text: '',
                },
              }
            : {},
        },
      });
      return x;
    }),
  isLastTransaction: adminModProcedure
    .input(z.object({ moneyAccountId: z.string(), transactionId: z.number() }))
    .query(async ({ input }) => {
      const moneyAccWithLastTx = await prisma.moneyAccount.findUnique({
        where: { id: input.moneyAccountId },
        include: {
          transactions: {
            take: 1,
            orderBy: { id: 'desc' },
          },
        },
      });

      if (!moneyAccWithLastTx) return true;

      if (moneyAccWithLastTx.transactions[0]?.id === input.transactionId)
        return true;

      return false;
    }),
  deleteById: adminProcedure
    .input(
      z.object({
        id: z.number(),
        moneyAccountId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      //for the moment being it will only allow delete if it's the last transaction.
      await checkIfIsLastTransaction({
        moneyAccountId: input.moneyAccountId,
        transactionId: input.id,
      });

      const x = await prisma?.transaction.delete({
        where: { id: input.id },
      });
      return x;
    }),
  cancelById: adminModProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.$transaction(async (txCtx) => {
        // Create a transaction that reverses the previous one and reference the new and old one with each other.,
        const tx = await txCtx.transaction.findUniqueOrThrow({
          where: { id: input.id },
          include: { searchableImage: { select: { id: true } } },
        });

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
            searchableImage: tx.searchableImage?.id
              ? {
                  connect: { id: tx.searchableImage?.id },
                }
              : {},
          },
        });
        if (cancellation.imbursementId) {
          await txCtx.imbursement.update({
            where: { id: cancellation.imbursementId },
            data: { wasCancelled: true },
          });
        }

        await txCtx.transaction.update({
          where: { id: input.id },
          data: {
            cancellationId: cancellation.id,
          },
        });

        return;
      });
    }),
});
