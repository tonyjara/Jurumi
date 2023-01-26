import type { FormTransactionCreate } from '@/lib/validations/transaction.create.validate';
import { validateTransactionCreate } from '@/lib/validations/transaction.create.validate';
import type { Prisma, searchableImage } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { adminModProcedure } from '../../initTrpc';
import {
  checkIfUserIsMoneyAdmin,
  transactionRouteUtils,
} from '../utils/Transaction.routeUtils';
import prisma from '@/server/db/client';

export const createManyTransactions = adminModProcedure
  .input(validateTransactionCreate)
  .mutation(async ({ input, ctx }) => {
    await prisma?.$transaction(async (txCtx) => {
      if (!input.moneyRequestId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'missing data',
        });
      }
      const user = ctx.session.user;
      const searchableImage = await createTxImage({ input });
      //1. Check money admin permissions
      await checkIfUserIsMoneyAdmin(user);
      for (const txField of input.transactions) {
        //2. Create transactions
        await createMoneyAccTransactions({
          accountId: ctx.session.user.id,
          formTransaction: input,
          searchableImage,
          txCtx,
        });
        //if the transaction has projectId and costCategoryId it automaticly creates the transaction for costCategoryId
        await transactionRouteUtils.createCostCategoryTransactions({
          accountId: ctx.session.user.id,
          formTransaction: input,
          searchableImage,
          txCtx,
          txField,
        });
      }
      //3. Change request status
      await prisma?.moneyRequest.update({
        where: { id: input.moneyRequestId },
        data: { status: 'ACCEPTED' },
      });
    });
  });

const createTxImage = async ({ input }: { input: FormTransactionCreate }) => {
  if (!input.searchableImage) return null;
  const imageProof = await prisma?.searchableImage.upsert({
    where: {
      imageName: input.searchableImage.imageName,
    },
    create: {
      url: input.searchableImage.url,
      imageName: input.searchableImage.imageName,
      text: '',
    },
    update: {},
  });

  return imageProof;
};

async function createMoneyAccTransactions({
  accountId,
  formTransaction,
  txCtx,
  searchableImage,
}: {
  formTransaction: FormTransactionCreate;
  accountId: string;
  txCtx: Prisma.TransactionClient;
  searchableImage: searchableImage | null | undefined;
}) {
  for (const tx of formTransaction.transactions) {
    const moneyAccountId = tx.moneyAccountId;

    // 1. Get latest transaction of the money Account
    const getMoneyAccAndLatestTx = await txCtx.moneyAccount.findUniqueOrThrow({
      where: { id: moneyAccountId },
      include: { transactions: { take: 1, orderBy: { id: 'desc' } } },
    });

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
        searchableImage: searchableImage
          ? {
              connect: { id: searchableImage.id },
            }
          : {},
      },
    });
  }
}
