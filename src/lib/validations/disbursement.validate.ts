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
const stringOptMinMax = (min: number, max: number) =>
  z
    .union([
      z.string().length(0, `El campo debe tener al menos (${min}) caractéres.`),
      z
        .string()
        .min(min, `El campo debe tener al menos (${min}) caractéres.`)
        .max(max, `Has superado el límite de caractérs (${max})`),
    ])
    .transform((e) => (e === '' ? '' : e));

type withMoney = Omit<Disbursement, 'amount'> & { amount?: any };

export const validateDisbursement: z.ZodType<withMoney> = z.lazy(() =>
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
    facturaNumber: stringOptMinMax(15, 15),
    status: z.nativeEnum(DisbursementStatus),
    disbursementType: z.nativeEnum(DisbursementType),
    currency: z.nativeEnum(Currency),
    amount: z.any().transform((value) => new Prisma.Decimal(value)),
    accountId: z.string(),
    taxPayerId: z.string().nullable(),
    bankId: z.string().nullable(),
    projectId: z.string().nullable(),
    pettyCashId: z.string().nullable(),
    softDeleted: z.boolean(),
    archived: z.boolean(),
  })
);

export type disbursementValidateData = z.infer<typeof validateDisbursement>;

export const defaultDisbursementValues: disbursementValidateData = {
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
  projectId: null,
  archived: false,
  softDeleted: false,
};
