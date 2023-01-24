import { z } from 'zod';
import { adminProcedure, protectedProcedure, router } from '../initTrpc';
import prisma from '@/server/db/client';
import { validateExpenseReturn } from '@/lib/validations/expenseReturn.validate';
import { expenseReturnCreateUtils } from './utils/ExpenseReturn.create.utils';
import { TRPCError } from '@trpc/server';

export const expenseReturnsRouter = router({
  create: protectedProcedure
    .input(validateExpenseReturn)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;

      await prisma.$transaction(async (txCtx) => {
        const imageProof =
          await expenseReturnCreateUtils.createExpenseReportProof({
            input,
            txCtx,
          });
        if (!imageProof) {
          throw new TRPCError({
            code: 'PRECONDITION_FAILED',
            message: 'no imbursement proof',
          });
        }

        const expenseReturn = await txCtx?.expenseReturn.create({
          data: {
            currency: input.currency,
            amountReturned: input.amountReturned,
            moneyAccountId: input.moneyAccountId,
            moneyRequestId: input.moneyRequestId,
            accountId: user.id,
            searchableImage: { connect: { id: imageProof.id } },
          },
          include: { searchableImage: { select: { id: true } } },
        });

        await expenseReturnCreateUtils.createMoneyAccountTx({
          txCtx,
          expenseReturn,
          accountId: user.id,
        });
      });
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
