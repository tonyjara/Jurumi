import { z } from "zod";
import { adminModObserverProcedure, router } from "../initTrpc";
import prisma from "@/server/db/client";
import { reqApprovalApprovedSlackNotification } from "./notifications/slack/reqApprovalApproved.notification.slack";
import { reqApprovalRejectionSlackNotification } from "./notifications/slack/reqApprovalRejection.notification.slack";

export const moneyApprovalRouter = router({
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
