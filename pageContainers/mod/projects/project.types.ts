import { Prisma } from "@prisma/client";

export const completeProjectArgs = Prisma.validator<Prisma.ProjectArgs>()({
  include: {
    _count: { select: { allowedUsers: true } },
    costCategories: {
      include: {
        transactions: {
          where: { transactionType: "COST_CATEGORY" },
          take: 1,
          orderBy: { id: "desc" },
          select: {
            openingBalance: true,
            currency: true,
            currentBalance: true,
            transactionAmount: true,
          },
        },
      },
    },
    transactions: {
      where: { transactionType: "PROJECT_IMBURSEMENT" },
      take: 1,
      orderBy: { id: "desc" },
      select: {
        openingBalance: true,
        currency: true,
        currentBalance: true,
        transactionAmount: true,
      },
    },
    allowedUsers: {
      take: 20,
      where: { role: "USER", active: true, isVerified: true },
      select: { id: true, displayName: true, email: true },
    },
  },
});

export type ProjectComplete = Prisma.ProjectGetPayload<
  typeof completeProjectArgs
>;

export const costCategoryReportArgs =
  Prisma.validator<Prisma.CostCategoryArgs>()({
    include: {
      transactions: {
        take: 1,
        orderBy: { id: "desc" },
        select: { id: true, currentBalance: true, currency: true },
      },
    },
  });

export type CostCategoryReport = Prisma.CostCategoryGetPayload<
  typeof costCategoryReportArgs
>;
