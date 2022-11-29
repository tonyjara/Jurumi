import type { BankAccount } from '@prisma/client';
import { Prisma } from '@prisma/client';
import {
  BankAccountType,
  BankDocType,
  BankNamesPy,
  Currency,
} from '@prisma/client';
import { z } from 'zod';

const stringReqMinMax = (reqText: string, min: number, max: number) =>
  z
    .string({ required_error: reqText })
    .min(min, `El campo debe tener al menos (${min}) caractéres.`)
    .max(max, `Has superado el límite de caractérs (${max})`);
const stringMinMax = (min: number, max: number) =>
  z
    .string()
    .min(min, `El campo debe tener al menos (${min}) caractéres.`)
    .max(max, `Has superado el límite de caractérs (${max})`);

//@ts-ignore
export const validateBankAccountCreate: z.ZodType<BankAccount> = z.lazy(() =>
  z.object({
    accountNumber: stringReqMinMax('Favor ingrese el número de cuenta.', 3, 64),
    balance: z
      .any()
      .or(z.number())
      .transform((value) => new Prisma.Decimal(value)),
    type: z.nativeEnum(BankAccountType),
    bankName: z.nativeEnum(BankNamesPy),
    city: stringReqMinMax('Favor seleccione una ciudad.', 3, 64),
    country: stringReqMinMax('Favor seleccione una país.', 3, 64),
    currency: z.nativeEnum(Currency),
    id: z.string(),
    ownerContactNumber: stringMinMax(10, 20).nullable(),
    ownerDoc: stringReqMinMax('Favor ingrese el documento del titular', 5, 20),
    ownerDocType: z.nativeEnum(BankDocType),
    ownerName: stringReqMinMax('Favor ingrese el nombre del titular', 2, 64),
    softDeleted: z.boolean(),
    updatedAt: z.date().nullable(),
    updatedById: z.string().nullable(),
    archived: z.boolean(),
    createdAt: z.date(),
    createdById: z.string(),
  })
);

export type bankAccCreateData = z.infer<typeof validateBankAccountCreate>;

export const defaultBankAccountValues: bankAccCreateData = {
  accountNumber: '',
  id: '',
  createdAt: new Date(),
  updatedAt: null,
  createdById: '',
  updatedById: null,
  bankName: 'ITAU',
  ownerName: '',
  ownerDocType: 'CI',
  ownerDoc: '',
  ownerContactNumber: null,
  currency: 'PYG',
  type: 'SAVINGS',
  country: '',
  city: '',
  balance: new Prisma.Decimal(0.0),
  archived: false,
  softDeleted: false,
};
