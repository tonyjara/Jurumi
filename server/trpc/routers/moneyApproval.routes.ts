import { z } from "zod";
import {
  adminModObserverProcedure,
  protectedProcedure,
  router,
} from "../initTrpc";
import prisma from "@/server/db/client";
import { reqApprovalApprovedSlackNotification } from "./notifications/slack/reqApprovalApproved.notification.slack";
import { reqApprovalRejectionSlackNotification } from "./notifications/slack/reqApprovalRejection.notification.slack";
import { MoneyResquestApprovalStatus } from "@prisma/client";
import { handleOrderBy } from "./utils/Sorting.routeUtils";
import { handleWhereImApprover } from "./utils/MoneyRequest.routeUtils";

export const moneyApprovalRouter = router({
  getManyCompleteForApprovalPage: adminModObserverProcedure
    .input(
      z.object({
        status: z.nativeEnum(MoneyResquestApprovalStatus).optional(),
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
            input.status ? handleWhereImApprover(input, user.id) : {},
            ...(input?.whereFilterList ?? []),
            { wasCancelled: false },
          ],
        },
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
              isCancellation: false,
            },
            include: {
              searchableImage: {
                select: { url: true, imageName: true },
              },
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
      });
    }),

  countWhereStatus: protectedProcedure
    .input(
      z.object({
        status: z.nativeEnum(MoneyResquestApprovalStatus).optional(),
        whereFilterList: z.any().array().optional(),
      })
    )
    .query(async ({ input }) =>
      prisma?.moneyRequest.count({
        where: {
          AND: [
            input.status ? { status: input.status } : {},
            ...(input?.whereFilterList ?? []),
            { wasCancelled: false },
          ],
        },
      })
    ),
  approve: adminModObserverProcedure
    .input(z.object({ moneyRequestId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;

      await prisma?.organization.findFirstOrThrow({
        where: {
          moneyRequestApprovers: { some: { id: user.id } },
        },
      });

      const prevApproval = await prisma?.moneyRequestApproval.findFirst({
        where: { accountId: user.id, moneyRequestId: input.moneyRequestId },
      });

      if (!prevApproval) {
        const approval = await prisma?.moneyRequestApproval.create({
          data: {
            moneyRequestId: input.moneyRequestId,
            status: "ACCEPTED",
            accountId: user.id,
            rejectMessage: "",
          },
          include: {
            account: { select: { displayName: true } },
            moneyRequest: { select: { organizationId: true } },
          },
        });
        await reqApprovalApprovedSlackNotification({ input: approval });
        return approval;
      }

      const approval = await prisma?.moneyRequestApproval.update({
        data: { status: "ACCEPTED", rejectMessage: "" },
        include: {
          account: { select: { displayName: true } },
          moneyRequest: { select: { organizationId: true } },
        },
        where: { id: prevApproval.id },
      });
      await reqApprovalApprovedSlackNotification({ input: approval });
      return approval;
    }),
  reject: adminModObserverProcedure
    .input(z.object({ moneyRequestId: z.string(), rejectMessage: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;

      await prisma?.organization.findFirstOrThrow({
        where: {
          moneyRequestApprovers: { some: { id: user.id } },
        },
      });
      const prevApproval = await prisma?.moneyRequestApproval.findFirst({
        where: { accountId: user.id, moneyRequestId: input.moneyRequestId },
      });
      if (prevApproval) {
        const approval = await prisma?.moneyRequestApproval.update({
          data: { status: "REJECTED", rejectMessage: input.rejectMessage },
          include: {
            account: { select: { displayName: true } },
            moneyRequest: { select: { organizationId: true } },
          },
          where: { id: prevApproval.id },
        });
        await reqApprovalRejectionSlackNotification({ input: approval });
        return approval;
      }
      const approval = await prisma?.moneyRequestApproval.create({
        data: {
          moneyRequestId: input.moneyRequestId,
          status: "REJECTED",
          accountId: user.id,
          rejectMessage: input.rejectMessage,
        },
        include: {
          account: { select: { displayName: true } },
          moneyRequest: { select: { organizationId: true } },
        },
      });
      await reqApprovalRejectionSlackNotification({ input: approval });
      return approval;
    }),
});
