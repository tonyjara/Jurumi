import { MoneyResquestApprovalStatus, Prisma } from '@prisma/client';
import { z } from 'zod';
import { validateMoneyRequest } from '@/lib/validations/moneyRequest.validate';
import {
  adminModObserverProcedure,
  adminProcedure,
  protectedProcedure,
  router,
} from '../initTrpc';
import {
  handleWhereImApprover,
  reimbursementOrderImageGuard as handleWhenReimbursementOrder,
} from './utils/MoneyRequest.routeUtils';
import { handleOrderBy } from './utils/Sorting.routeUtils';
import prisma from '@/server/db/client';
import {
  cancelExpenseReports,
  cancelExpenseReturns,
  cancelMoneyReqApprovals,
  cancelTransactions,
} from './utils/Cancelations.routeUtils';
import { upsertTaxPayter } from './utils/TaxPayer.routeUtils';
import { createMoneyRequestSlackNotification } from './notifications/slack/moneyRequestCreate.notification.slack';

export const moneyRequestRouter = router({
  getMany: adminModObserverProcedure.query(async () => {
    return await prisma?.moneyRequest.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
  }),
  countMyPendingRequests: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    return await prisma?.moneyRequest.findMany({
      where: { accountId: user.id, status: 'PENDING' },
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
        pageIndex: z.number().nullish(),
        pageSize: z.number().min(1).max(100).nullish(),
        sorting: z
          .object({ id: z.string(), desc: z.boolean() })
          .array()
          .nullish(),
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

        where: { accountId: user.id, status: input.status },
      });
    }),
  count: protectedProcedure.query(async () => prisma?.moneyRequest.count()),
  countWhereStatus: protectedProcedure
    .input(
      z.object({
        status: z.nativeEnum(MoneyResquestApprovalStatus).optional(),
      })
    )
    .query(async ({ input }) =>
      prisma?.moneyRequest.count({
        where: input.status ? { status: input.status } : {},
      })
    ),
  countMyOwn: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    return await prisma?.moneyRequest.count({ where: { accountId: user.id } });
  }),

  getManyComplete: adminModObserverProcedure
    .input(
      z.object({
        status: z.nativeEnum(MoneyResquestApprovalStatus).optional(),
        pageIndex: z.number().nullish(),
        pageSize: z.number().min(1).max(100).nullish(),
        sorting: z
          .object({ id: z.string(), desc: z.boolean() })
          .array()
          .nullish(),
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
        include: {
          taxPayer: {
            select: { bankInfo: true, razonSocial: true, ruc: true, id: true },
          },
          account: true,
          project: true,
          costCategory: true,
          transactions: {
            where: {
              cancellationId: null,
              costCategoryId: null,
              isCancellation: false,
            },
          },
          searchableImages: true,
          moneyRequestApprovals: { where: { wasCancelled: false } },
          expenseReports: {
            where: { wasCancelled: false },
            include: { taxPayer: { select: { id: true, razonSocial: true } } },
          },
          expenseReturns: { where: { wasCancelled: false } },
          organization: {
            select: {
              moneyRequestApprovers: {
                select: { id: true, displayName: true },
              },
              moneyAdministrators: { select: { id: true, displayName: true } },
            },
          },
        },

        where: input.status ? handleWhereImApprover(input, user.id) : {},
      });
    }),
  findCompleteById: adminModObserverProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      if (!input.id.length) return null;
      return await prisma?.moneyRequest.findUnique({
        where: { id: input.id },
        include: {
          taxPayer: {
            select: { bankInfo: true, razonSocial: true, ruc: true, id: true },
          },
          account: true,
          project: true,
          costCategory: true,
          transactions: true,
          moneyRequestApprovals: true,
          searchableImages: true,
          expenseReports: {
            where: { wasCancelled: false },
            include: { taxPayer: { select: { id: true, razonSocial: true } } },
          },
          expenseReturns: { where: { wasCancelled: false } },
          organization: {
            select: {
              moneyRequestApprovers: {
                select: { id: true, displayName: true },
              },
              moneyAdministrators: { select: { id: true, displayName: true } },
            },
          },
        },
      });
    }),
  create: protectedProcedure
    .input(validateMoneyRequest)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;

      const taxPayer = await upsertTaxPayter({
        input: input.taxPayer,
        userId: user.id,
      });

      const uploadedImages = await handleWhenReimbursementOrder({
        input,
      });

      const MoneyReq = await prisma?.moneyRequest.create({
        data: {
          accountId: user.id,
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
      return MoneyReq;
    }),

  // edit executed amount when going from other than accepted
  edit: protectedProcedure
    .input(validateMoneyRequest)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      const taxPayer = await upsertTaxPayter({
        input: input.taxPayer,
        userId: user.id,
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
        },
      });
      return x;
    }),
  cancelById: adminProcedure
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

        await cancelTransactions({
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

        await cancelTransactions({
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
        data: { status: 'REJECTED' },
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
});
