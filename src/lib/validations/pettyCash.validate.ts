import type { PettyCash } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { Currency } from '@prisma/client';
import { z } from 'zod';

const stringReqMinMax = (reqText: string, min: number, max: number) =>
  z
    .string({ required_error: reqText })
    .min(min, `El campo debe tener al menos (${min}) caractéres.`)
    .max(max, `Has superado el límite de caractérs (${max})`);

type withMoney = Omit<PettyCash, 'amount'> & { amount?: any };

export const validatePettyCash: z.ZodType<withMoney> = z.lazy(() =>
  z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date().nullable(),
    createdById: z.string(),
    updatedById: z.string().nullable(),
    displayName: stringReqMinMax('Favor ingrese un nombre', 3, 32),
    amount: z.any().transform((value) => new Prisma.Decimal(value)),

    currency: z.nativeEnum(Currency),
    archived: z.boolean(),
    softDeleted: z.boolean(),
  })
);

export type pettyCashCreateData = z.infer<typeof validatePettyCash>;

export const defaultPettyCashValues: pettyCashCreateData = {
  id: '',
  createdAt: new Date(),
  updatedAt: null,
  createdById: '',
  updatedById: null,
  displayName: '',
  amount: new Prisma.Decimal(0),
  currency: 'PYG',
  archived: false,
  softDeleted: false,
};
