import type { moneyReqTaxPayer } from "@/lib/validations/moneyRequest.validate";
import prisma from "@/server/db/client";
import type { TaxPayer } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const upsertTaxPayer = async ({
  input,
  userId,
}: {
  input: moneyReqTaxPayer;
  userId: string;
}): Promise<TaxPayer> => {
  const taxPayer = await prisma?.taxPayer.upsert({
    where: {
      ruc: input.ruc,
    },
    create: {
      createdById: userId,
      razonSocial: input.razonSocial,
      ruc: input.ruc,
      bankInfo: input.bankInfo
        ? {
            create: {
              bankName: input.bankInfo?.bankName,
              accountNumber: input.bankInfo?.accountNumber,
              ownerName: input.bankInfo?.ownerName,
              ownerDocType: input.bankInfo?.ownerDocType,
              ownerDoc: input.bankInfo?.ownerDoc,
              type: input.bankInfo?.type,
            },
          }
        : undefined,
    },
    update: {
      bankInfo: input.bankInfo
        ? {
            upsert: {
              create: {
                bankName: input.bankInfo?.bankName ?? "BANCOP",
                accountNumber: input.bankInfo?.accountNumber ?? "",
                ownerName: input.bankInfo?.ownerName ?? "",
                ownerDocType: input.bankInfo?.ownerDocType ?? "CI",
                ownerDoc: input.bankInfo?.ownerDoc ?? "",
                type: input.bankInfo?.type ?? "CURRENT",
              },

              update: {
                bankName: input.bankInfo?.bankName,
                accountNumber: input.bankInfo?.accountNumber,
                ownerName: input.bankInfo?.ownerName,
                ownerDocType: input.bankInfo?.ownerDocType,
                ownerDoc: input.bankInfo?.ownerDoc,
                type: input.bankInfo?.type,
              },
            },
          }
        : undefined,
    },
  });
  if (!taxPayer) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Taxpayer not created",
    });
  }
  return taxPayer;
};
