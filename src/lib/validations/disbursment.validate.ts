import type { Disbursement } from '@prisma/client';
import { DisbursementStatus, DisbursementType } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { Currency } from '@prisma/client';
import { z } from 'zod';

const stringReqMinMax = (reqText: string, min: number, max: number) =>
  z
    .string({ required_error: reqText })
    .min(min, `El campo debe tener al menos (${min}) caractéres.`)
    .max(max, `Has superado el límite de caractérs (${max})`);

type withMoney = Omit<Disbursement, 'amount'> & { amount?: any };

export const validateDisbursment: z.ZodType<withMoney> = z.lazy(() =>
  z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date().nullable(),
    createdById: z.string(),
    updatedById: z.string().nullable(),

    description: stringReqMinMax(
      'Favor ingrese el concepto del desembolso.',
      6,
      128
    ),
    scannedText: z.string(),
    pictureUrl: z.string(),
    facturaNumber: z.string(),
    status: z.nativeEnum(DisbursementStatus),
    disbursementType: z.nativeEnum(DisbursementType),
    currency: z.nativeEnum(Currency),
    amount: z.any().transform((value) => new Prisma.Decimal(value)),
    accountId: z.string(),
    taxPayerId: z.string().nullable(),
    bankId: z.string(),
    projectId: z.string({
      required_error: 'Favor seleccione una proyecto.',
    }),
    pettyCashId: z.string(),
    softDeleted: z.boolean(),
    archived: z.boolean(),
  })
);

export type disbursmentValidateData = z.infer<typeof validateDisbursment>;

export const defaultDisbursmentValues: disbursmentValidateData = {
  id: '',
  createdAt: new Date(),
  updatedAt: null,
  createdById: '',
  updatedById: null,
  description: '',
  scannedText: '',
  pictureUrl: '',
  facturaNumber: '',
  status: 'PENDING',
  disbursementType: 'MONEY_ORDER',
  currency: 'PYG',
  amount: new Prisma.Decimal(0),
  accountId: '',
  taxPayerId: null,
  bankId: null,
  pettyCashId: null,
  projectId: null,
  archived: false,
  softDeleted: false,
};
