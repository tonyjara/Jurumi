import type { moneyReqTaxPayer } from "@/lib/validations/moneyRequest.validate";
import prisma from "@/server/db/client";
import type { TaxPayer } from "@prisma/client";

export const upsertTaxPayer = async ({
  input,
  userId,
}: {
  input: moneyReqTaxPayer;
  userId: string;
}): Promise<TaxPayer> => {
  const bankInfo = input.bankInfo?.accountNumber.length ? input.bankInfo : null;

  if (input.id) {
    return await prisma?.taxPayer.update({
      where: { id: input.id },
      data: {
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
  }

  return await prisma?.taxPayer.create({
    data: {
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
  });
};
