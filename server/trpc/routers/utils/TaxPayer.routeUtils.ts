import type {
  ValidMoneyReqTaxPayer,
  moneyReqTaxPayer,
} from "@/lib/validations/moneyRequest.validate";
import prisma from "@/server/db/client";
import {
  BankAccountType,
  BankDocType,
  BankNamesPy,
  TaxPayerBankInfo,
  type TaxPayer,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const ValidMoneyReqTaxPayerSchema: z.ZodType<ValidMoneyReqTaxPayer> =
  z.lazy(() =>
    z.object({
      id: z.string().nullable(),
      razonSocial: z.string(),
      ruc: z.string(),
      bankInfo: z
        .object({
          bankName: z.nativeEnum(BankNamesPy),
          accountNumber: z.string(),
          taxPayerId: z.string(),
          ownerName: z.string(),
          ownerDocType: z.nativeEnum(BankDocType),
          ownerDoc: z.string(),
          type: z.nativeEnum(BankAccountType),
        })
        .nullable(),
    }),
  );
export const isDataForTaxPayerValid = (input: moneyReqTaxPayer) =>
  ValidMoneyReqTaxPayerSchema.safeParse(input);

export const upsertTaxPayer = async ({
  input,
  userId,
}: {
  input: moneyReqTaxPayer;
  userId: string;
}): Promise<TaxPayer> => {
  if (!isDataForTaxPayerValid(input)) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "invalid data" });
  }
  const bankInfo = input?.bankInfo as TaxPayerBankInfo | null;

  if (input.id) {
    return await prisma?.taxPayer.update({
      where: { id: input.id },
      data: {
        bankInfo: bankInfo
          ? {
              upsert: {
                create: {
                  bankName: bankInfo.bankName,
                  accountNumber: bankInfo.accountNumber,
                  ownerName: bankInfo?.ownerName,
                  ownerDocType: bankInfo.ownerDocType,
                  ownerDoc: bankInfo.ownerDoc,
                  type: bankInfo.type,
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
      razonSocial: input.razonSocial ?? "",
      ruc: input.ruc ?? "",
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
