import { Prisma } from "@prisma/client";

export const completeModExpenseReportsArgs =
  Prisma.validator<Prisma.ExpenseReportDefaultArgs>()({
    include: {
      costCategory: { select: { id: true, displayName: true } },
      account: { select: { displayName: true, id: true } },
      project: { select: { displayName: true, id: true } },
      taxPayer: {
        select: { fantasyName: true, razonSocial: true, ruc: true, id: true },
      },
      searchableImage: { select: { url: true, imageName: true } },
    },
  });

export const completeHomeExpenseReportsArgs =
  Prisma.validator<Prisma.ExpenseReportDefaultArgs>()({
    include: {
      project: { select: { displayName: true, id: true } },
      costCategory: { select: { id: true, displayName: true } },
      taxPayer: {
        select: { fantasyName: true, razonSocial: true, ruc: true, id: true },
      },
      searchableImage: { select: { url: true, imageName: true } },
    },
  });

export type ModExpenseReportComplete = Prisma.ExpenseReportGetPayload<
  typeof completeModExpenseReportsArgs
>;

export type HomeExpenseReportComplete = Prisma.ExpenseReportGetPayload<
  typeof completeHomeExpenseReportsArgs
>;
