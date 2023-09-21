import { Prisma } from "@prisma/client";

export const completeHomeMoneyRequestIncludeArgs =
  Prisma.validator<Prisma.MoneyRequestArgs>()({
    include: {
      project: true,
      transactions: true,
      account: { select: { displayName: true } },
      taxPayer: {
        select: {
          razonSocial: true,
          ruc: true,
          bankInfo: true,
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

export type CompleteMoneyReqHome = Prisma.MoneyRequestGetPayload<
  typeof completeHomeMoneyRequestIncludeArgs
>;
