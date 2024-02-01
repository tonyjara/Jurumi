import { Prisma } from "@prisma/client";

export const getManyImbursementsArgs =
  Prisma.validator<Prisma.ImbursementDefaultArgs>()({
    include: {
      transactions: { select: { id: true } },
      account: { select: { id: true, displayName: true } },
      project: { select: { id: true, displayName: true } },
      taxPayer: {
        select: { razonSocial: true, ruc: true, id: true, bankInfo: true },
      },
      moneyAccount: { select: { displayName: true } },
      imbursementProof: { select: { imageName: true, url: true } },
      invoiceFromOrg: { select: { imageName: true, url: true } },
    },
  });

export type ImbursementComplete = Prisma.ImbursementGetPayload<
  typeof getManyImbursementsArgs
>;
