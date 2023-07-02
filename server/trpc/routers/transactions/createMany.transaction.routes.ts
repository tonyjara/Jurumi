import type { FormTransactionCreate } from "@/lib/validations/transaction.create.validate";
import { validateTransactionCreate } from "@/lib/validations/transaction.create.validate";
import type { Prisma, searchableImage } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { adminModProcedure } from "../../initTrpc";
import {
  checkIfUserIsMoneyAdmin,
  transactionRouteUtils,
} from "../utils/Transaction.routeUtils";
import prisma from "@/server/db/client";
import { moneyRequestApprovedBrowserNotification } from "../notifications/browser/moneyReqApprovedAndExecuted.notification.browser";
import { moneyRequestApprovedSendgridNotification } from "../notifications/sendgrid/moneyReqApprovedAndExecuted.notification.sendgrid";
import { moneyRequestApprovedDbNotification } from "../notifications/db/moneyReqApprovedAndExecuted.notification.db";
import { saveEmailMsgToDb } from "../notifications/db/saveEmailToDb";

export const createManyTransactionsForMoneyRequests = adminModProcedure
  .input(validateTransactionCreate)
  .mutation(async ({ input, ctx }) => {
    await prisma?.$transaction(
      async (txCtx) => {
        if (!input.moneyRequestId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "missing data",
          });
        }
        const user = ctx.session.user;
        input.accountId = user.id;

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
        const req = await txCtx?.moneyRequest.update({
          where: { id: input.moneyRequestId },
          data: { status: "ACCEPTED" },
          include: {
            account: {
              select: {
                displayName: true,
                email: true,
                preferences: { select: { receiveEmailNotifications: true } },
              },
            },
          },
        });

        //4. Send notifications
        await moneyRequestApprovedDbNotification({ input: req, txCtx });
        await moneyRequestApprovedBrowserNotification({ input: req, txCtx });
        const msg = await moneyRequestApprovedSendgridNotification({
          input: req,
        });

        if (!msg) return;
        await saveEmailMsgToDb({
          accountId: user.id,
          msg,
          tag: "moneyReqApproved",
        });
      },
      { timeout: 20000 }
    );
  });

const createTxImage = async ({ input }: { input: FormTransactionCreate }) => {
  if (!input.searchableImage) return null;
  const imageProof = await prisma?.searchableImage.upsert({
    where: {
      imageName: input.searchableImage.imageName,
    },
    create: {
      accountId: input.accountId,
      url: input.searchableImage.url,
      imageName: input.searchableImage.imageName,
      text: "",
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
      include: { transactions: { take: 1, orderBy: { id: "desc" } } },
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
        transactionType: "MONEY_ACCOUNT",
        wasConvertedToOtherCurrency: tx.wasConvertedToOtherCurrency,
        exchangeRate: tx.exchangeRate,

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
