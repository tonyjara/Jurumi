import {
  adminModObserverProcedure,
  adminProcedure,
  publicProcedure,
  router,
} from "../initTrpc";
import prisma from "@/server/db/client";
import { validateBecomeMemberRequest } from "@/lib/validations/becomeMember.validate";
import { z } from "zod";

export const reportsRouter = router({
  getProjectReport: adminModObserverProcedure
    .input(z.object({ projectId: z.string().optional() }))
    .query(async ({ input }) => {
      if (!input.projectId) return [];

      return await prisma.costCategory.findMany({
        where: { projectId: input.projectId },
        include: {
          transactions: {
            take: 1,
            orderBy: { id: "desc" },
            select: { id: true, currentBalance: true, currency: true },
          },
        },
      });
    }),
  getProjectImbursements: adminModObserverProcedure
    .input(z.object({ projectId: z.string().optional() }))
    .query(async ({ input }) => {
      if (!input.projectId) return [];

      return await prisma.imbursement.findMany({
        where: { projectId: input.projectId },
        orderBy: { createdAt: "desc" },
      });
    }),
});
