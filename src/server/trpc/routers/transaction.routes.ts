import { z } from 'zod';
import { reduceTransactionFields } from '../../../lib/utils/TransactionUtils';
import { validateTransactionCreate } from '../../../lib/validations/transaction.create.validate';
import { validateTransactionEdit } from '../../../lib/validations/transaction.edit.validate';
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
          Imbursement: true,
          ExpenseReturn: true,
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
          Imbursement: true,
          ExpenseReturn: true,
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
        const moneyRequest = await prisma?.moneyRequest.update({
          where: { id: input.moneyRequestId },
          data: { status: 'ACCEPTED' },
        });
        //3. Substract from cost categories
        if (!moneyRequest || !moneyRequest.costCategoryId) return;
        const costCat = await prisma?.costCategory.findUnique({
          where: { id: moneyRequest.costCategoryId },
        });
        if (!costCat) return;

        await prisma?.costCategory.update({
          where: { id: moneyRequest?.costCategoryId },
          data: {
            executedAmount: costCat.executedAmount.add(
              reduceTransactionFields(input.transactions)
            ),
          },
        });
      }
      return x;
    }),
  edit: adminModProcedure
    .input(validateTransactionEdit)
    .mutation(async ({ input, ctx }) => {
      // For the moment being it will only allow edit if it's the last transaction

      await checkIfIsLastTransaction({
        moneyAccountId: input.moneyAccountId,
        transactionId: input.id,
      });

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
        },
      });
      return x;
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
});
