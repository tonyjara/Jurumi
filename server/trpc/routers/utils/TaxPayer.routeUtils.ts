import type { moneyReqTaxPayer } from '@/lib/validations/moneyRequest.validate';

export const upsertTaxPayter = async ({
  input,
  userId,
}: {
  input: moneyReqTaxPayer;
  userId: string;
}) => {
  if (!input.razonSocial.length || !input.razonSocial) return;
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
  return taxPayer;
};
