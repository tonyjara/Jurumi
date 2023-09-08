import type { moneyReqTaxPayer } from "@/lib/validations/moneyRequest.validate";
import prisma from "@/server/db/client";
import type { TaxPayer } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const upsertTaxPayer = async ({
  input,
  userId,
}: {
  input: moneyReqTaxPayer | null;
  userId: string;
}): Promise<TaxPayer | null> => {
  if (!input || !input.bankInfo?.accountNumber.length) return null;

  const bankInfo = input.bankInfo?.accountNumber.length ? input.bankInfo : null;

  const taxPayer = await prisma?.taxPayer.upsert({
    where: {
      ruc: input.ruc,
    },
    create: {
      createdById: userId,
      razonSocial: input.razonSocial,
      ruc: input.ruc,
      bankInfo: bankInfo
        ? {
            create: {
              bankName: bankInfo.bankName,
              accountNumber: bankInfo.accountNumber,
              ownerName: bankInfo.ownerName,
              ownerDocType: bankInfo.ownerDocType,
              ownerDoc: bankInfo.ownerDoc,
              type: bankInfo.type,
            },
          }
        : undefined,
    },
    update: {
      bankInfo: bankInfo
        ? {
            upsert: {
              create: {
                bankName: bankInfo.bankName ?? "BANCOP",
                accountNumber: bankInfo.accountNumber,
                ownerName: bankInfo.ownerName ?? "",
                ownerDocType: bankInfo.ownerDocType ?? "CI",
                ownerDoc: bankInfo.ownerDoc ?? "",
                type: bankInfo.type ?? "CURRENT",
              },

              update: {
                bankName: bankInfo.bankName,
                accountNumber: bankInfo.accountNumber,
                ownerName: bankInfo.ownerName,
                ownerDocType: bankInfo.ownerDocType,
                ownerDoc: bankInfo.ownerDoc,
                type: bankInfo.type,
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
