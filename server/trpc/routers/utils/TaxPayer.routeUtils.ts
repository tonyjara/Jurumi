import type { moneyReqTaxPayer } from '@/lib/validations/moneyRequest.validate';
import prisma from '@/server/db/client';
import type { TaxPayer } from '@prisma/client';
import { TRPCError } from '@trpc/server';

export const upsertTaxPayter = async ({
  input,
  userId,
}: {
  input: moneyReqTaxPayer;
  userId: string;
}): Promise<TaxPayer> => {
  if (!input.razonSocial.length || !input.razonSocial)
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Taxpayer not created',
    });
  const taxPayer = await prisma?.taxPayer.upsert({
    where: {
      ruc: input.ruc,
    },
    create: {
      createdById: userId,
      razonSocial: input.razonSocial,
      ruc: input.ruc,
      bankInfo: {
        create: input.bankInfo
          ? {
              bankName: input.bankInfo?.bankName,
              accountNumber: input.bankInfo?.accountNumber,
              ownerName: input.bankInfo?.ownerName,
              ownerDocType: input.bankInfo?.ownerDocType,
              ownerDoc: input.bankInfo?.ownerDoc,
              type: input.bankInfo?.type,
            }
          : undefined,
      },
    },
    update: {
      bankInfo: {
        upsert: {
          create: {
            bankName: input.bankInfo?.bankName ?? 'BANCOP',
            accountNumber: input.bankInfo?.accountNumber ?? '',
            ownerName: input.bankInfo?.ownerName ?? '',
            ownerDocType: input.bankInfo?.ownerDocType ?? 'CI',
            ownerDoc: input.bankInfo?.ownerDoc ?? '',
            type: input.bankInfo?.type ?? 'CURRENT',
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
      },
    },
  });
  if (!taxPayer) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Taxpayer not created',
    });
  }
  return taxPayer;
};
