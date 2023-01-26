import type { FormTransactionCreate } from '@/lib/validations/transaction.create.validate';
import { validateTransactionCreate } from '@/lib/validations/transaction.create.validate';
import type { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { adminModProcedure } from '../../initTrpc';
import {
  checkIfUserIsMoneyAdmin,
  transactionRouteUtils,
} from '../utils/Transaction.routeUtils';

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
      //1. Check money admin permissions
      await checkIfUserIsMoneyAdmin(user);
      for (const txField of input.transactions) {
        //2. Create transactions
        await createMoneyAccTransactions({
          accountId: ctx.session.user.id,
          formTransaction: input,
          txCtx,
        });
        await transactionRouteUtils.createCostCategoryTransactions({
          accountId: ctx.session.user.id,
          formTransaction: input,
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

//const createTxImage = async ({
//  input,
//}: {
//  input:TransactionField
//}) => {
//  if (!input.imbursementProof) {
//    throw new TRPCError({
//      code: 'PRECONDITION_FAILED',
//      message: 'no imbursement proof',
//    });
//  }
//  const imbursementProof = await prisma?.searchableImage.upsert({
//    where: {
//      imageName: input.imbursementProof?.imageName,
//    },
//    create: {
//      url: input.imbursementProof.url,
//      imageName: input.imbursementProof.imageName,
//      text: '',
//    },
//    update: {},
//  });
//
//  return imbursementProof;
//};

async function createMoneyAccTransactions({
  accountId,
  formTransaction,
  txCtx,
}: {
  formTransaction: FormTransactionCreate;
  accountId: string;
  txCtx: Prisma.TransactionClient;
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
}
