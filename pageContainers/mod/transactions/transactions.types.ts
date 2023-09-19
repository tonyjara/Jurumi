import { Prisma } from "@prisma/client";

export const completeTransactionsArgs =
  Prisma.validator<Prisma.TransactionArgs>()({
    include: {
      moneyAccountOffset: true,
      moneyAccount: { select: { displayName: true, id: true } },
      account: { select: { displayName: true, id: true } },
      moneyRequest: true,
      costCategory: { select: { displayName: true, id: true } },
      imbursement: true,
      expenseReturn: true,
      expenseReport: { select: { taxPayer: true, facturaNumber: true } },
      project: { select: { displayName: true, id: true } },
      searchableImage: { select: { id: true, url: true, imageName: true } },
    },
  });

export type TransactionComplete = Prisma.TransactionGetPayload<
  typeof completeTransactionsArgs
>;
