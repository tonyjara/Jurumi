import { Prisma } from "@prisma/client";
import { z } from "zod";
import type { FormBankInfo } from "@/lib/validations/moneyAcc.validate";
import { validateMoneyAccount } from "@/lib/validations/moneyAcc.validate";
import {
  adminProcedure,
  adminModProcedure,
  router,
  protectedProcedure,
  adminModObserverProcedure,
} from "../initTrpc";
import prisma from "@/server/db/client";
import { validateMoneyAccountOffset } from "@/lib/validations/moneyAccountOffset.validate";
import { handleOrderBy } from "./utils/Sorting.routeUtils";
import { cancelTransactionsAndRevertBalance } from "./utils/Cancelations.routeUtils";
import { TRPCError } from "@trpc/server";

export const moneyAccRouter = router({
  getMany: adminModObserverProcedure.query(async () => {
    return await prisma?.moneyAccount.findMany();
  }),

  getManyWithTransactions: adminModObserverProcedure.query(async () => {
    return await prisma?.moneyAccount.findMany({
      include: {
        _count: { select: { transactions: true } },
        bankInfo: true,
        transactions: {
          orderBy: { id: "desc" },
          include: {
            account: { select: { displayName: true } },
            moneyAccount: { select: { displayName: true } },
            moneyRequest: { select: { description: true } },
            imbursement: { select: { concept: true } },
            searchableImage: {
              select: { id: true, url: true, imageName: true },
            },
          },
        },
      },
      take: 20,
      orderBy: { id: "desc" },
    });
  }),

  countccountOffsets: adminModObserverProcedure.query(
    async () => prisma?.moneyAccountOffset.count(),
  ),
  getManyAccountOffsets: adminModObserverProcedure
    .input(
      z.object({
        pageIndex: z.number().nullish(),
        pageSize: z.number().min(1).max(100).nullish(),
        sorting: z
          .object({ id: z.string(), desc: z.boolean() })
          .array()
          .nullish(),
      }),
    )
    .query(async ({ input }) => {
      const pageSize = input.pageSize ?? 10;
      const pageIndex = input.pageIndex ?? 0;
      return await prisma?.moneyAccountOffset.findMany({
        include: {
          account: { select: { displayName: true } },
          moneyAccount: { select: { displayName: true } },
          transactions: { select: { id: true } },
        },
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: handleOrderBy({ input }),
      });
    }),
  getManyPublic: protectedProcedure.query(async () => {
    return await prisma?.moneyAccount.findMany({
      select: {
        displayName: true,
        id: true,
        currency: true,
        bankInfo: true,
        // bankInfo: true,
      },
    });
  }),

  getManyBankAccWithLastTx: adminModObserverProcedure.query(async () => {
    return await prisma?.moneyAccount.findMany({
      where: { isCashAccount: false },
      include: {
        bankInfo: true,
        transactions: { take: 1, orderBy: { id: "desc" } },
      },
    });
  }),
  getManyCashAccsWithLastTx: adminModObserverProcedure.query(async () => {
    return await prisma?.moneyAccount.findMany({
      where: { isCashAccount: true },
      include: { transactions: { take: 1, orderBy: { id: "desc" } } },
    });
  }),
  create: adminModProcedure
    .input(validateMoneyAccount)
    .mutation(async ({ input: i, ctx }) => {
      const bankInfo: FormBankInfo | undefined = i.bankInfo
        ? {
            bankName: i.bankInfo.bankName,
            type: i.bankInfo.type,
            accountNumber: i.bankInfo.accountNumber,
            ownerName: i.bankInfo.ownerName,
            ownerDocType: i.bankInfo.ownerDocType,
            ownerDoc: i.bankInfo.ownerDoc,
            country: i.bankInfo.country,
            city: i.bankInfo.city,
            ownerContactNumber: i.bankInfo.ownerContactNumber,
          }
        : undefined;

      const x = await prisma?.moneyAccount.create({
        data: {
          createdById: ctx.session.user.id,
          isCashAccount: i.isCashAccount,
          displayName: i.displayName,
          currency: i.currency,
          initialBalance: new Prisma.Decimal(i.initialBalance),
          bankInfo: i.isCashAccount ? undefined : { create: bankInfo },
          organization: { connect: { id: i.organizationId } },
        },
      });
      return x;
    }),
  edit: adminModProcedure
    .input(validateMoneyAccount)
    .mutation(async ({ input: i, ctx }) => {
      const bankInfo: FormBankInfo | undefined = i.bankInfo
        ? {
            bankName: i.bankInfo.bankName,
            type: i.bankInfo.type,
            accountNumber: i.bankInfo.accountNumber,
            ownerName: i.bankInfo.ownerName,
            ownerDocType: i.bankInfo.ownerDocType,
            ownerDoc: i.bankInfo.ownerDoc,
            country: i.bankInfo.country,
            city: i.bankInfo.city,
            ownerContactNumber: i.bankInfo.ownerContactNumber,
          }
        : undefined;

      const x = await prisma?.moneyAccount.update({
        where: { id: i.id },
        data: {
          createdById: ctx.session.user.id,
          isCashAccount: i.isCashAccount,
          displayName: i.displayName,
          currency: i.currency,
          initialBalance: new Prisma.Decimal(i.initialBalance),
          bankInfo: i.isCashAccount ? undefined : { update: bankInfo },
        },
      });
      return x;
    }),
  offsetBalance: adminModProcedure
    .input(validateMoneyAccountOffset)
    .mutation(async ({ input: i, ctx }) => {
      const userId = ctx.session.user.id;
      await prisma.$transaction(async (txCtx) => {
        const getMoneyAccWithLastTx = async () => {
          return await txCtx.moneyAccount.findUniqueOrThrow({
            where: { id: i.moneyAccountId },
            include: {
              transactions: {
                where: {
                  NOT: {
                    transactionType: {
                      in: ["COST_CATEGORY", "PROJECT_IMBURSEMENT"],
                    },
                  },
                },
                take: 1,
                orderBy: { id: "desc" },
              },
            },
          });
        };

        const lastMoneyAccWithTx = await getMoneyAccWithLastTx();
        //If there's no prev balance use the initial one
        const previousBalance = lastMoneyAccWithTx.transactions[0]
          ? lastMoneyAccWithTx.transactions[0].currentBalance
          : lastMoneyAccWithTx.initialBalance;

        //calculate current balance based on the offset type
        const currentBalance = i.isSubstraction
          ? previousBalance.sub(i.offsettedAmount)
          : previousBalance.add(i.offsettedAmount);

        await txCtx.moneyAccountOffset.create({
          data: {
            moneyAccountId: i.moneyAccountId,
            currency: i.currency,
            offsettedAmount: i.offsettedAmount,
            offsetJustification: i.offsetJustification,
            previousBalance,
            isSubstraction: i.isSubstraction,
            accountId: userId,
            transactions: {
              create: {
                openingBalance: previousBalance,
                currentBalance: currentBalance,
                transactionAmount: i.offsettedAmount,
                transactionType: "OFFSET",
                moneyAccountId: i.moneyAccountId,
                currency: i.currency,
                accountId: userId,
              },
            },
          },
        });
      });
    }),
  deleteById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const x = await prisma?.moneyAccount.delete({
        where: { id: input.id },
      });
      return x;
    }),
  deleteMoneyAccountOffsetById: adminProcedure
    .input(
      z.object({
        id: z.string(),
        transactionId: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await prisma?.transaction.delete({
        where: { id: input.transactionId },
      });
      const x = await prisma?.moneyAccountOffset.delete({
        where: { id: input.id },
      });
      return x;
    }),

  cancelMoneyAccountOffsetById: adminModProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      /* await prisma.$transaction(async (txCtx) => { */
      /*   const moneyAccOffset = await txCtx?.moneyAccountOffset.update({ */
      /*     where: { id: input.id }, */
      /*     data: { wasCancelled: true }, */
      /*     include: { */
      /*       //Account offsets only have one transaction */
      /*       transactions: true, */
      /*     }, */
      /*   }); */
      /*   await cancelTransactionsAndRevertBalance({ */
      /*     txCtx, */
      /*     transactions: moneyAccOffset.transactions, */
      /*   }); */
      /* }); */

      await prisma.$transaction(async (txCtx) => {
        const offset = await txCtx?.moneyAccountOffset.update({
          where: { id: input.id },
          data: { wasCancelled: true },
          include: {
            //Account offsets only have one transaction
            transactions: true,
          },
        });
        const offsetTx = offset.transactions[0];
        if (!offsetTx) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Offset transaction not found",
          });
        }

        const getMoneyAccWithLastTx = async () => {
          return await txCtx.moneyAccount.findUniqueOrThrow({
            where: { id: offset.moneyAccountId },
            include: {
              transactions: {
                where: {
                  NOT: {
                    transactionType: {
                      in: ["COST_CATEGORY", "PROJECT_IMBURSEMENT"],
                    },
                  },
                },
                take: 1,
                orderBy: { id: "desc" },
              },
            },
          });
        };

        const lastMoneyAccWithTx = await getMoneyAccWithLastTx();

        //If there's no prev balance use the initial one
        const previousBalance = lastMoneyAccWithTx.transactions[0]
          ? lastMoneyAccWithTx.transactions[0].currentBalance
          : lastMoneyAccWithTx.initialBalance;

        //Restore offseted amount
        const currentBalance = offset.isSubstraction
          ? previousBalance.add(offset.offsettedAmount)
          : previousBalance.sub(offset.offsettedAmount);

        const cancellation = await txCtx.transaction.create({
          data: {
            isCancellation: true,
            accountId: offset.accountId,
            currency: offset.currency,
            cancellationId: offsetTx.id,
            transactionAmount: offset.offsettedAmount,
            openingBalance: previousBalance,
            currentBalance,
            moneyAccountId: offset.moneyAccountId,
            transactionType: "OFFSET",
            moneyAccountOffsetId: offset.id,
            // do not need searchable image in a cancellation.
          },
        });

        // attach id to cancelled transaction
        await txCtx.transaction.update({
          where: { id: offsetTx.id },
          data: {
            cancellationId: cancellation.id,
          },
        });
      });
    }),
});
