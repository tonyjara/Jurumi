import type { FormExpenseReport } from '@/lib/validations/expenseReport.validate';
import type { FormTransactionCreate } from '@/lib/validations/transaction.create.validate';
import { validateTransactionCreate } from '@/lib/validations/transaction.create.validate';
import { TRPCError } from '@trpc/server';
import { adminModProcedure } from '../../initTrpc';
import { checkIfUserIsMoneyAdmin } from '../utils/Transaction.routeUtils';

export const createManyTransactions = adminModProcedure
  .input(validateTransactionCreate)
  .mutation(async ({ input, ctx }) => {
    if (!input.moneyRequestId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'missing data',
      });
    }
    const user = ctx.session.user;
    //1. Check money admin permissions
    await checkIfUserIsMoneyAdmin(user);
    //2. Create transactions
    await createManyMoneyAccountTransactions({
      accountId: ctx.session.user.id,
      formTransaction: input,
    });
    // await createCostCategoryTransactions({
    //   accountId: ctx.session.user.id,
    //   formTransaction: input,
    // });

    //3. Change request status
    await prisma?.moneyRequest.update({
      where: { id: input.moneyRequestId },
      data: { status: 'ACCEPTED' },
    });
  });

async function createManyMoneyAccountTransactions({
  accountId,
  formTransaction,
}: {
  formTransaction: FormTransactionCreate;
  accountId: string;
}) {
  return await prisma?.$transaction(async (txCtx) => {
    for (const tx of formTransaction.transactions) {
      const moneyAccountId = tx.moneyAccountId;

      // 1. Get latest transaction of the money Account
      const getMoneyAccAndLatestTx = await txCtx.moneyAccount.findUniqueOrThrow(
        {
          where: { id: moneyAccountId },
          include: { transactions: { take: 1, orderBy: { id: 'desc' } } },
        }
      );

      // 2. Calculate balance based on transaction or initialbalance

      const lastTx = getMoneyAccAndLatestTx?.transactions[0];

      const openingBalance = lastTx
        ? lastTx.currentBalance
        : getMoneyAccAndLatestTx.initialBalance;

      const currentBalance = lastTx
        ? lastTx.currentBalance.sub(tx.transactionAmount)
        : getMoneyAccAndLatestTx.initialBalance.sub(tx.transactionAmount);

      await txCtx.transaction.create({
        data: {
          transactionAmount: tx.transactionAmount,
          accountId,
          currency: tx.currency,
          openingBalance: openingBalance,
          currentBalance: currentBalance,
          transactionType: 'MONEY_ACCOUNT',
          moneyAccountId,
          moneyRequestId: formTransaction.moneyRequestId,
          imbursementId: formTransaction.imbursementId,
          expenseReturnId: formTransaction.expenseReturnId,
          searchableImage: formTransaction.searchableImage?.imageName.length
            ? {
                create: {
                  url: formTransaction.searchableImage.url,
                  imageName: formTransaction.searchableImage.imageName,
                  text: '',
                },
              }
            : {},
        },
      });
    }
  });
}
