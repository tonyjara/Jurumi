import type { Transaction } from '@prisma/client';
import { z } from 'zod';
import { validateTransaction } from '../../../lib/validations/transaction.validate';
import { adminModProcedure, adminProcedure, router } from '../initTrpc';

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
  findCompleteById: adminModProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      if (!input.id.length) return null;
      return await prisma?.transaction.findUnique({
        where: { id: parseInt(input.id) },
        include: {
          moneyAccount: true,
          account: true,
          moneyRequest: true,
          Imbursement: true,
          ExpenseReturn: true,
        },
      });
    }),

  create: adminModProcedure
    .input(validateTransaction)
    .mutation(async ({ input, ctx }) => {
      const x = (await prisma?.transaction.create({
        data: {
          accountId: ctx.session.user.id,
          currency: input.currency,
          openingBalance: input.openingBalance,
          transactionAmount: input.transactionAmount,
          moneyAccountId: input.moneyAccountId,
          transactionProofUrl: input.transactionProofUrl,
          moneyRequestId: input.moneyRequestId,
          imbursementId: input.imbursementId,
          expenseReturnId: input.expenseReturnId,
        },
      })) as Transaction | undefined;

      if (input.moneyRequestId && x) {
        await prisma?.moneyRequest.update({
          where: { id: input.moneyRequestId },
          data: { status: 'ACCEPTED', transactions: { connect: { id: x.id } } },
        });
      }
      return x;
    }),
  edit: adminModProcedure
    .input(validateTransaction)
    .mutation(async ({ input, ctx }) => {
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
      })
    )
    .mutation(async ({ input }) => {
      const x = await prisma?.transaction.delete({
        where: { id: input.id },
      });
      return x;
    }),
});
