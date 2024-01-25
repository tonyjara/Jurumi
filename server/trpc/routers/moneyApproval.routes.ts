import { z } from "zod";
import {
  adminModObserverProcedure,
  adminProcedure,
  protectedProcedure,
  router,
} from "../initTrpc";
import prisma from "@/server/db/client";
import { reqApprovalApprovedSlackNotification } from "./notifications/slack/reqApprovalApproved.notification.slack";
import { reqApprovalRejectionSlackNotification } from "./notifications/slack/reqApprovalRejection.notification.slack";
import { ApprovalStatus, MoneyResquestApprovalStatus } from "@prisma/client";
import { handleOrderBy } from "./utils/Sorting.routeUtils";
/* import { handleWhereImApprover } from "./utils/MoneyRequest.routeUtils"; */
import { completeMoneyRequestWithApprovalIncludeArgs } from "@/pageContainers/mod/approvals/mod.approvals.types";

export const moneyApprovalRouter = router({
  getManyCompleteForApprovalPage: adminModObserverProcedure
    .input(
      z.object({
        status: z.nativeEnum(ApprovalStatus).optional(),
        pageIndex: z.number().nullish(),
        pageSize: z.number().min(1).max(100).nullish(),
        sorting: z
          .object({ id: z.string(), desc: z.boolean() })
          .array()
          .nullish(),
        whereFilterList: z.any().array().optional(),
      }),
    )
    .query(async ({ input }) => {
      const pageSize = input.pageSize ?? 10;
      const pageIndex = input.pageIndex ?? 0;

      return await prisma?.moneyRequest.findMany({
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: handleOrderBy({ input }),
        where: {
          AND: [
            /* handleWhereImApprover(input, user.id, user), */
            {
              ...(input?.whereFilterList ?? []),
              wasCancelled: false,
              approvalStatus: input.status,
            },
          ],
        },
        ...completeMoneyRequestWithApprovalIncludeArgs,
      });
    }),

  countWhereStatus: protectedProcedure
    .input(
      z.object({
        status: z.nativeEnum(MoneyResquestApprovalStatus).optional(),
        whereFilterList: z.any().array().optional(),
      }),
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
      }),
    ),
  approve: adminModObserverProcedure
    .input(z.object({ moneyRequestId: z.string(), organizationId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const isAdmin = user.role === "ADMIN";

      const approvers = await prisma.organization.findFirstOrThrow({
        where: {
          id: input.organizationId,
        },
        select: {
          moneyRequestApprovers: {
            select: {
              id: true,
              displayName: true,
            },
          },
        },
      });

      //If all approvals have been made, then change the status of the money request to accepted
      const moneyRequest = await prisma.moneyRequest.findUniqueOrThrow({
        where: { id: input.moneyRequestId },
        select: {
          moneyRequestApprovals: true,
        },
      });

      const approvalsSet = new Set();
      moneyRequest.moneyRequestApprovals.forEach((approval) => {
        approval.status === "ACCEPTED" && approvalsSet.add(approval.accountId);
      });
      approvalsSet.add(user.id);

      const approversSet = new Set();
      approvers.moneyRequestApprovers.forEach((approver) => {
        approversSet.add(approver.id);
      });

      const areSetsEqual = (a: any, b: any) =>
        a.size === b.size && [...a].every((value) => b.has(value));

      //NOTE: Guard do not allow to approve if you are not an approver
      await prisma?.organization.findFirstOrThrow({
        where: {
          moneyRequestApprovers: { some: { id: user.id } },
        },
      });

      if (areSetsEqual(approversSet, approvalsSet)) {
        await prisma?.moneyRequest.update({
          where: { id: input.moneyRequestId },
          data: {
            approvalStatus: "ACCEPTED",
          },
        });
      }

      const prevApprovalMadeByThisUser =
        await prisma?.moneyRequestApproval.findFirst({
          where: { accountId: user.id, moneyRequestId: input.moneyRequestId },
        });

      if (!prevApprovalMadeByThisUser) {
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
        where: { id: prevApprovalMadeByThisUser.id },
      });

      await reqApprovalApprovedSlackNotification({ input: approval });
      return approval;
    }),
  adminApprove: adminProcedure
    .input(z.object({ moneyRequestId: z.string() }))
    .mutation(async ({ input }) => {
      const req = await prisma.moneyRequest.update({
        where: { id: input.moneyRequestId },
        data: { approvalStatus: "ACCEPTED" },
      });

      return req;
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
