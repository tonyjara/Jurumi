import { MoneyResquestApprovalStatus, Prisma } from "@prisma/client";
import { z } from "zod";
import { validateMoneyRequest } from "@/lib/validations/moneyRequest.validate";
import {
  adminModObserverProcedure,
  adminModProcedure,
  adminProcedure,
  protectedProcedure,
  router,
} from "../initTrpc";
import {
  handleHomeRequestsExtraFilters,
  handleMoneyRequestExtraFilters,
  reimbursementOrderImageGuard,
} from "./utils/MoneyRequest.routeUtils";
import { handleOrderBy } from "./utils/Sorting.routeUtils";
import prisma from "@/server/db/client";
import {
  cancelExpenseReports,
  cancelExpenseReturns,
  cancelMoneyReqApprovals,
  cancelTransactionsAndRevertBalance,
} from "./utils/Cancelations.routeUtils";
import { upsertTaxPayer } from "./utils/TaxPayer.routeUtils";
import { createMoneyRequestSlackNotification } from "./notifications/slack/moneyRequestCreate.notification.slack";
import {
  beingReportedRawSqlShort,
  executionPengingRawSql,
} from "@/server/db/raw-sql";
import { moneyRequestCreatedApproversEmailNotification } from "./notifications/sendgrid/emailApproversOnRequest.sendgrid";
import { completeMoneyRequestIncludeArgs } from "@/pageContainers/mod/requests/mod.requests.types";

export const moneyRequestRouter = router({
  getMany: adminModObserverProcedure.query(async () => {
    return await prisma?.moneyRequest.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
    });
  }),
  countMyPendingRequests: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    return await prisma?.moneyRequest.findMany({
      where: { wasCancelled: false, accountId: user.id, status: "PENDING" },
      select: {
        createdAt: true,
        id: true,
        amountRequested: true,
        currency: true,
      },
    });
  }),

  getMyOwnComplete: protectedProcedure
    .input(
      z.object({
        status: z.nativeEnum(MoneyResquestApprovalStatus).optional(),
        extraFilters: z.string().array(),
        pageIndex: z.number().nullish(),
        pageSize: z.number().min(1).max(100).nullish(),
        sorting: z
          .object({ id: z.string(), desc: z.boolean() })
          .array()
          .nullish(),
        whereFilterList: z.any().array().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const pageSize = input.pageSize ?? 10;
      const pageIndex = input.pageIndex ?? 0;

      return await prisma?.moneyRequest.findMany({
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: handleOrderBy({ input }),
        where: {
          AND: [
            ...handleHomeRequestsExtraFilters({
              extraFilters: input.extraFilters,
            }),
            { accountId: user.id, status: input.status },
            ...(input?.whereFilterList ?? []),
          ],
        },

        include: {
          project: true,
          transactions: true,
          account: { select: { displayName: true } },
          taxPayer: {
            select: {
              razonSocial: true,
              bankInfo: {
                select: {
                  ownerName: true,
                  accountNumber: true,
                  bankName: true,
                  ownerDocType: true,
                  ownerDoc: true,
                },
              },
            },
          },
          expenseReports: {
            where: { wasCancelled: false },
            include: { taxPayer: { select: { razonSocial: true } } },
          },
          expenseReturns: { where: { wasCancelled: false } },
          searchableImages: true,
        },
      });
    }),
  count: protectedProcedure
    .input(
      z.object({
        extraFilters: z.string().array(),
        whereFilterList: z.any().array().optional(),
      })
    )
    .query(async ({ input }) => {
      const getHasBeingReportedIds = await beingReportedRawSqlShort();
      const getExecutionPendingIds = await executionPengingRawSql();

      return prisma?.moneyRequest.count({
        where: {
          AND: [
            ...handleMoneyRequestExtraFilters({
              extraFilters: input.extraFilters,
              getHasBeingReportedIds,
              getExecutionPendingIds,
            }),
            ,
            ...(input?.whereFilterList ?? []),
          ],
        },
      });
    }),

  countMyOwn: protectedProcedure
    .input(
      z.object({
        extraFilters: z.string().array(),
        whereFilterList: z.any().array().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.session.user;
      return await prisma?.moneyRequest.count({
        where: {
          AND: [
            ...handleHomeRequestsExtraFilters({
              extraFilters: input.extraFilters,
            }),
            ...(input?.whereFilterList ?? []),
            { accountId: user.id },
          ],
        },
      });
    }),

  getManyComplete: adminModObserverProcedure
    .input(
      z.object({
        extraFilters: z.string().array(),
        pageIndex: z.number().nullish(),
        pageSize: z.number().min(1).max(100).nullish(),
        sorting: z
          .object({ id: z.string(), desc: z.boolean() })
          .array()
          .nullish(),
        whereFilterList: z.any().array().optional(),
      })
    )
    .query(async ({ input }) => {
      const pageSize = input.pageSize ?? 10;
      const pageIndex = input.pageIndex ?? 0;

      //This handles raw sql queries
      const getHasBeingReportedIds = await beingReportedRawSqlShort();
      const getExecutionPendingIds = await executionPengingRawSql();

      return await prisma?.moneyRequest.findMany({
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: handleOrderBy({ input }),
        where: {
          AND: [
            ...handleMoneyRequestExtraFilters({
              extraFilters: input.extraFilters,
              getHasBeingReportedIds,
              getExecutionPendingIds,
            }),
            ...(input?.whereFilterList ?? []),
          ],
        },
        ...completeMoneyRequestIncludeArgs,
      });
    }),

  findCompleteById: adminModObserverProcedure
    .input(
      z.object({
        value: z.string(),
        filter: z.string(),
        extraFilters: z.string().array(),
        whereFilterList: z.any().array().optional(),
      })
    )
    .query(async ({ input }) => {
      if (!input.value.length || !input.filter.length) return null;

      const getHasBeingReportedIds = await beingReportedRawSqlShort();
      const getExecutionPendingIds = await executionPengingRawSql();

      const handleWhere = () => {
        if (input.filter === "amountRequested") {
          return {
            ["amountRequested"]: {
              ["gte"]: new Prisma.Decimal(parseInt(input.value)),
            },
          };
        }

        return { ["id"]: input.value };
      };

      return await prisma?.moneyRequest.findMany({
        where: {
          AND: [
            ...handleMoneyRequestExtraFilters({
              extraFilters: input.extraFilters,
              getHasBeingReportedIds,
              getExecutionPendingIds,
            }),
            handleWhere() ?? {},
            ...(input?.whereFilterList ?? []),
          ],
        },
        ...completeMoneyRequestIncludeArgs,
      });
    }),
  create: protectedProcedure
    .input(validateMoneyRequest)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      input.accountId = user.id;

      const taxPayer = input.taxPayer
        ? await upsertTaxPayer({
            input: input.taxPayer,
            userId: user.id,
          })
        : null;

      const uploadedImages = await reimbursementOrderImageGuard({
        input,
      });

      const MoneyReq = await prisma?.moneyRequest.create({
        data: {
          accountId: user.id,
          operationDate: new Date(),
          amountRequested: new Prisma.Decimal(input.amountRequested),
          currency: input.currency,
          description: input.description,
          moneyRequestType: input.moneyRequestType,
          projectId: input.projectId,
          status: input.status,
          rejectionMessage: input.rejectionMessage,
          organizationId: input.organizationId,
          comments: input.comments,
          taxPayerId: taxPayer?.id,
          costCategoryId: input.costCategoryId,
          facturaNumber: input.facturaNumber,
          searchableImages: uploadedImages?.length
            ? {
                connect: input.searchableImages.map((x) => ({
                  imageName: x.imageName,
                })),
              }
            : {},
        },
        include: { account: { select: { displayName: true } } },
      });

      await createMoneyRequestSlackNotification({ input: MoneyReq });
      await moneyRequestCreatedApproversEmailNotification({ input: MoneyReq });
      return MoneyReq;
    }),

  // edit executed amount when going from other than accepted
  edit: protectedProcedure
    .input(validateMoneyRequest)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      input.accountId = user.id;

      const taxPayer = input.taxPayer
        ? await upsertTaxPayer({
            input: input.taxPayer,
            userId: user.id,
          })
        : null;

      const uploadedImages = await reimbursementOrderImageGuard({
        input,
      });

      const x = await prisma?.moneyRequest.update({
        where: { id: input.id },
        data: {
          taxPayerId: taxPayer?.id,
          amountRequested: new Prisma.Decimal(input.amountRequested),
          currency: input.currency,
          comments: input.comments,
          description: input.description,
          moneyRequestType: input.moneyRequestType,
          projectId: input.projectId,
          status: input.status,
          rejectionMessage: input.rejectionMessage,
          organizationId: input.organizationId,
          searchableImages: uploadedImages?.length
            ? {
                connect: input.searchableImages.map((x) => ({
                  imageName: x.imageName,
                })),
              }
            : {},
        },
      });
      return x;
    }),
  cancelById: adminModProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.$transaction(async (txCtx) => {
        const moneyReq = await txCtx?.moneyRequest.update({
          where: { id: input.id },
          data: { wasCancelled: true },
          include: {
            expenseReports: true,
            expenseReturns: true,
            transactions: true,
            moneyRequestApprovals: true,
          },
        });

        await cancelTransactionsAndRevertBalance({
          txCtx,
          transactions: moneyReq.transactions,
        });
        await cancelExpenseReports({
          txCtx,
          expenseReports: moneyReq.expenseReports,
        });
        await cancelExpenseReturns({
          txCtx,
          expenseReturns: moneyReq.expenseReturns,
        });
        await cancelMoneyReqApprovals({
          txCtx,
          moneyRequestApprovals: moneyReq.moneyRequestApprovals,
        });
      });
    }),
  cancelMyOwnById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await prisma.$transaction(async (txCtx) => {
        const user = ctx.session.user;
        //verifies that the current user owns the request canceling
        await txCtx.moneyRequest.findFirstOrThrow({
          where: { id: input.id, accountId: user.id },
        });

        const moneyReq = await txCtx.moneyRequest.update({
          where: { id: input.id },
          data: { wasCancelled: true },
          include: {
            expenseReports: true,
            expenseReturns: true,
            transactions: true,
            moneyRequestApprovals: true,
          },
        });

        await cancelTransactionsAndRevertBalance({
          txCtx,
          transactions: moneyReq.transactions,
        });
        await cancelExpenseReports({
          txCtx,
          expenseReports: moneyReq.expenseReports,
        });
        await cancelExpenseReturns({
          txCtx,
          expenseReturns: moneyReq.expenseReturns,
        });
        await cancelMoneyReqApprovals({
          txCtx,
          moneyRequestApprovals: moneyReq.moneyRequestApprovals,
        });
      });
    }),
  rejectMyOwn: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.moneyRequest.update({
        where: { id: input.id },
        data: { status: "REJECTED" },
      });
    }),

  deleteById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.moneyRequestApproval.deleteMany({
        where: { moneyRequestId: input.id },
      });
      await prisma.transaction.deleteMany({
        where: { moneyRequestId: input.id },
      });
      await prisma.expenseReport.deleteMany({
        where: { moneyRequestId: input.id },
      });
      await prisma.expenseReturn.deleteMany({
        where: { moneyRequestId: input.id },
      });

      const x = await prisma?.moneyRequest.delete({
        where: { id: input.id },
      });
      return x;
    }),
  changeOperationDate: adminModProcedure
    .input(z.object({ date: z.date(), id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.moneyRequest.update({
        where: { id: input.id },
        data: { operationDate: input.date },
      });
    }),
});
