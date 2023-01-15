import { MoneyResquestApprovalStatus, Prisma } from '@prisma/client';
import { z } from 'zod';
import { validateMoneyRequest } from '../../../lib/validations/moneyRequest.validate';
import {
  adminModProcedure,
  adminProcedure,
  protectedProcedure,
  router,
} from '../initTrpc';
import { handleWhereImApprover } from './utils/MoneyRequestUtils';
import { handleOrderBy } from './utils/SortingUtils';
import prisma from '@/server/db/client';

export const moneyRequestRouter = router({
  getMany: adminModProcedure.query(async () => {
    return await prisma?.moneyRequest.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
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
          expenseReports: true,
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

  getManyComplete: adminModProcedure
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
          account: true,
          project: true,
          transactions: { where: { cancellationId: null } },
          moneyRequestApprovals: true,
          expenseReports: true,
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
  findCompleteById: adminModProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      if (!input.id.length) return null;
      return await prisma?.moneyRequest.findUnique({
        where: { id: input.id },
        include: {
          account: true,
          project: true,
          transactions: true,
          moneyRequestApprovals: true,
          expenseReports: true,
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
          costCategoryId: input.costCategoryId,
        },
      });

      return MoneyReq;
    }),
  // edit executed amount when going from other than accepted
  edit: protectedProcedure
    .input(validateMoneyRequest)
    .mutation(async ({ input }) => {
      const x = await prisma?.moneyRequest.update({
        where: { id: input.id },
        data: {
          amountRequested: new Prisma.Decimal(input.amountRequested),
          currency: input.currency,
          description: input.description,
          moneyRequestType: input.moneyRequestType,
          projectId: input.projectId,
          //if it was rejected and edited, it automaticly gets reseted to pending
          status: input.status === 'REJECTED' ? 'PENDING' : input.status,
          rejectionMessage: input.rejectionMessage,
          organizationId: input.organizationId,
          costCategoryId: input.costCategoryId,
        },
      });
      return x;
    }),
  //TODO substract from costcategory if it was accepted
  deleteById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const x = await prisma?.moneyRequest.delete({
        where: { id: input.id },
      });
      return x;
    }),
});
