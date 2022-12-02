import type { MoneyRequest } from '@prisma/client';
import { MoneyRequestStatus, MoneyRequestType } from '@prisma/client';
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

type withMoney = Omit<MoneyRequest, 'amountRequested'> & {
  amountRequested?: any;
};

export const validateMoneyRequest: z.ZodType<withMoney> = z.lazy(() =>
  z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date().nullable(),
    description: stringReqMinMax(
      'Favor ingrese el concepto del desembolso.',
      6,
      128
    ),
    status: z.nativeEnum(MoneyRequestStatus),
    moneyRequestType: z.nativeEnum(MoneyRequestType),
    currency: z.nativeEnum(Currency),
    amountRequested: z.any().transform((value) => new Prisma.Decimal(value)),
    fundSentPictureUrl: z.string(),
    accountId: z.string(),
    moneyAccountId: z.string().nullable(),
    projectId: z.string().nullable(),
    archived: z.boolean(),
    softDeleted: z.boolean(),
  })
);

export type disbursementValidateData = z.infer<typeof validateMoneyRequest>;

export const defaultDisbursementValues: disbursementValidateData = {
  id: '',
  createdAt: new Date(),
  updatedAt: null,
  description: '',
  status: 'PENDING',
  moneyRequestType: 'FUND_REQUEST',
  currency: 'USD',
  amountRequested: new Prisma.Decimal(0),
  fundSentPictureUrl: '',
  accountId: '',
  moneyAccountId: null,
  projectId: null,
  archived: false,
  softDeleted: false,
};
