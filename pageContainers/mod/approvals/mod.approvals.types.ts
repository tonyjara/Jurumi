import { Prisma } from "@prisma/client";

export const completeMoneyRequestWithApprovalIncludeArgs =
  Prisma.validator<Prisma.MoneyRequestArgs>()({
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

export type MonyRequestCompleteWithApproval = Prisma.MoneyRequestGetPayload<
  typeof completeMoneyRequestWithApprovalIncludeArgs
>;
