import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { validateTransactionCreate } from '../../../lib/validations/transaction.create.validate';
import { validateTransactionEdit } from '../../../lib/validations/transaction.edit.validate';
import { adminModProcedure, adminProcedure, router } from '../initTrpc';
import {
  checkIfIsLastTransaction,
  createManyMoneyAccountTransactions,
} from './utils/TransactionRouteUtils';

export const transactionsRouter = router({
  getMany: adminModProcedure.query(async () => {
    return await prisma?.transaction.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
  }),
  getManyComplete: adminModProcedure.query(async () => {
    return await prisma?.transaction.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
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
      const x = await createManyMoneyAccountTransactions({
        accountId: ctx.session.user.id,
        formTransaction: input,
      });

      if (input.moneyRequestId && x) {
        await prisma?.moneyRequest.update({
          where: { id: input.moneyRequestId },
          data: { status: 'ACCEPTED' },
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
          transactionProofUrl: input.transactionProofUrl,
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
