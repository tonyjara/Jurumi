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

export const BankInfoModel = z.object({
  bankName: z.nativeEnum(BankNamesPy),
  accountNumber: z.string(),
  ownerName: stringReqMinMax('Favor ingrese el nombre del titular', 2, 64),
  ownerDocType: z.nativeEnum(BankDocType),
  ownerDoc: z.string(),
  ownerContactNumber: stringMinMax(10, 20).nullable(),
  country: stringReqMinMax('Favor seleccione una país.', 3, 64),
  city: stringReqMinMax('Favor seleccione una ciudad.', 3, 64),
  type: z.nativeEnum(BankAccountType),
});

export const MoneyAccountModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  createdById: z.string(),
  displayName: z.string(),
  updatedById: z.string().nullish(),
  isCashAccount: z.boolean(),
  currency: z.nativeEnum(Currency),
  initialBalance: z.any().transform((value) => new Prisma.Decimal(value)),
  archived: z.boolean(),
  softDeleted: z.boolean(),
});

export type BankInfoModel = z.infer<typeof BankInfoModel>;

export interface CompleteMoneyAccount
  extends z.infer<typeof MoneyAccountModel> {
  bankInfo?: BankInfoModel | null;
}
// type withMoney = Omit<BankAccount, 'balance'> & { balance?: any };
type MoneyAccountWithOmit = Omit<CompleteMoneyAccount, 'initialBalance'> & {
  initialBalance?: any;
};

export const validateMoneyAccount: z.ZodSchema<MoneyAccountWithOmit> = z.lazy(
  () =>
    MoneyAccountModel.extend({
      bankInfo: BankInfoModel.nullish(),
    })
);

export type MoneyAccWithBankInfo = z.infer<typeof validateMoneyAccount>;

const defaultBankInfoValues: BankInfoModel = {
  bankName: 'ITAU',
  type: 'SAVINGS',
  accountNumber: '',
  ownerName: '',
  ownerDocType: 'CI',
  ownerDoc: '',
  country: '',
  city: '',
  ownerContactNumber: null,
};

export const defaultMoneyAccValues: MoneyAccWithBankInfo = {
  id: '',
  createdAt: new Date(),
  updatedAt: null,
  createdById: '',
  updatedById: null,
  isCashAccount: false,
  currency: 'PYG',
  initialBalance: new Prisma.Decimal(0),
  displayName: '',
  archived: false,
  softDeleted: false,
  bankInfo: defaultBankInfoValues,
};
