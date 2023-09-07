import { adminModObserverProcedure, router } from "../initTrpc";
import prisma from "@/server/db/client";
import { z } from "zod";
import { costCategoryReportArgs } from "@/pageContainers/mod/projects/project.types";

export const reportsRouter = router({
  getCostCategoryReport: adminModObserverProcedure
    .input(z.object({ projectId: z.string().optional() }))
    .query(async ({ input }) => {
      if (!input.projectId) return [];

      return await prisma.costCategory.findMany({
        where: { projectId: input.projectId },
        ...costCategoryReportArgs,
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
