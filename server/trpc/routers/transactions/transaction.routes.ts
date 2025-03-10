import { z } from "zod";
import { validateTransactionEdit } from "@/lib/validations/transaction.edit.validate";
import {
  adminModObserverProcedure,
  adminModProcedure,
  adminProcedure,
  router,
} from "../../initTrpc";
import { handleOrderBy } from "../utils/Sorting.routeUtils";
import prisma from "@/server/db/client";
import { createManyTransactionsForMoneyRequests } from "./createMany.transaction.routes";
import { completeTransactionsArgs } from "@/pageContainers/mod/transactions/transactions.types";
import { transactionRouteUtils } from "../utils/Transaction.routeUtils";

export const transactionsRouter = router({
  getMany: adminModObserverProcedure.query(async () => {
    return await prisma?.transaction.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
    });
  }),
  count: adminModObserverProcedure
    .input(
      z.object({
        whereFilterList: z.any().array().optional(),
      }),
    )
    .query(async ({ input }) => {
      return await prisma?.transaction.count({
        where: { AND: [...(input?.whereFilterList ?? [])] },
      });
    }),
  getManyComplete: adminModObserverProcedure
    .input(
      z.object({
        pageIndex: z.number().nullish(),
        pageSize: z.number().min(1).nullish(),
        whereFilterList: z.any().array().optional(),
        sorting: z
          .object({ id: z.string(), desc: z.boolean() })
          .array()
          .nullish(),
      }),
    )
    .query(async ({ input }) => {
      const pageSize = input.pageSize ?? 10;
      const pageIndex = input.pageIndex ?? 0;
      return await prisma?.transaction.findMany({
        where: {
          AND: [...(input?.whereFilterList ?? [])],
        },
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: handleOrderBy({ input }),
        ...completeTransactionsArgs,
      });
    }),
  findManyCompleteById: adminModObserverProcedure
    .input(z.object({ ids: z.number().array() }))
    .query(async ({ input }) => {
      if (!input.ids.length) return null;
      return await prisma?.transaction.findMany({
        where: { id: { in: input.ids } },
        ...completeTransactionsArgs,
      });
    }),

  changeOperationDate: adminModProcedure
    .input(z.object({ date: z.date(), id: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.transaction.update({
        where: { id: input.id },
        data: { operationDate: input.date },
      });
    }),
  createMany: createManyTransactionsForMoneyRequests,
  edit: adminModProcedure
    .input(validateTransactionEdit)
    .mutation(async ({ input, ctx }) => {
      const x = await prisma?.transaction.update({
        where: { id: input.id },
        data: {
          updatedById: ctx.session.user.id,
          /* currency: input.currency, */
          /* openingBalance: input.openingBalance, */
          /* transactionAmount: input.transactionAmount, */
          /* moneyAccountId: input.moneyAccountId, */
          /* moneyRequestId: input.moneyRequestId, */
          /* imbursementId: input.imbursementId, */
          /* expenseReturnId: input.expenseReturnId, */
          searchableImage: input.searchableImage
            ? {
                create: {
                  url: input.searchableImage.url,
                  imageName: input.searchableImage.imageName,
                  text: "",
                },
              }
            : {},
        },
      });
      return x;
    }),
  isLastTransaction: adminModObserverProcedure
    .input(
      z.object({
        moneyAccountId: z.string().nullable(),
        transactionId: z.number(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.moneyAccountId) return false;
      const moneyAccWithLastTx = await prisma.moneyAccount.findUnique({
        where: { id: input.moneyAccountId },
        include: {
          transactions: {
            take: 1,
            orderBy: { id: "desc" },
          },
        },
      });

      if (!moneyAccWithLastTx) return true;

      if (moneyAccWithLastTx.transactions[0]?.id === input.transactionId)
        return true;

      return false;
    }),

  /* DO NOT DELETE TRANSACTIONS DIRECTLY */
  deleteById: adminProcedure
    .input(
      z.object({
        id: z.number(),
        moneyAccountId: z.string().nullable(),
        costCategoryId: z.string().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      const isDevEnv = process.env.NODE_ENV === "development";
      if (!isDevEnv)
        throw new Error("You can't delete transactions in production");

      //for the moment being it will only allow delete if it's the last transaction.

      await transactionRouteUtils.checkIfIsLastTransaction({
        moneyAccountId: input.moneyAccountId,
        costCategoryId: input.costCategoryId,
        transactionId: input.id,
      });

      const x = await prisma?.transaction.delete({
        where: { id: input.id },
      });
      return x;
    }),
});
