import type { BankInfo, MoneyAccount } from '@prisma/client';
import { Prisma } from '@prisma/client';
import {
  BankAccountType,
  BankDocType,
  BankNamesPy,
  Currency,
} from '@prisma/client';
import { z } from 'zod';
import { stringMinMax, stringReqMinMax } from '../utils/ValidationHelpers';

export const BankInfoModel: z.ZodType<Omit<BankInfo, 'moneyAccountId'>> =
  z.lazy(() =>
    z.object({
      bankName: z.nativeEnum(BankNamesPy),
      accountNumber: z.string(),
      ownerName: z.string(),
      ownerDocType: z.nativeEnum(BankDocType),
      ownerDoc: z.string(),
      ownerContactNumber: stringMinMax(10, 20).nullable(),
      country: z.string(),
      city: z.string(),
      type: z.nativeEnum(BankAccountType),
    })
  );
export type FormBankInfo = z.infer<typeof BankInfoModel>;

export interface FormMoneyAccWithBankInfo extends MoneyAccount {
  bankInfo: FormBankInfo | null;
}
export type FormMoneyAccount = Omit<
  FormMoneyAccWithBankInfo,
  'initialBalance'
> & {
  initialBalance?: any;
};

export const validateMoneyAccount: z.ZodType<FormMoneyAccount> = z.lazy(() =>
  z
    .object({
      id: z.string(),
      createdAt: z.date(),
      updatedAt: z.date().nullable(),
      createdById: z.string(),
      displayName: stringReqMinMax(
        'Favor ingrese un nombre para su cuenta',
        3,
        64
      ),
      updatedById: z.string().nullable(),
      isCashAccount: z.boolean(),
      currency: z.nativeEnum(Currency),
      initialBalance: z.any().transform((value) => new Prisma.Decimal(value)),
      archived: z.boolean(),
      softDeleted: z.boolean(),
      bankInfo: BankInfoModel.nullable(),
    })
    .superRefine((val, ctx) => {
      if (
        !val.isCashAccount &&
        val.bankInfo &&
        val.bankInfo?.country.length < 3
      ) {
        ctx.addIssue({
          path: ['bankInfo.country'],
          code: z.ZodIssueCode.custom,
          message: 'Favor ingrese el nombre de un país.',
        });
      }
      if (!val.isCashAccount && val.bankInfo && val.bankInfo?.city.length < 2) {
        ctx.addIssue({
          path: ['bankInfo.city'],
          code: z.ZodIssueCode.custom,
          message: 'Favor ingrese el nombre de una ciudad.',
        });
      }
      if (
        !val.isCashAccount &&
        val.bankInfo &&
        val.bankInfo?.ownerName.length < 3
      ) {
        ctx.addIssue({
          path: ['bankInfo.ownerName'],
          code: z.ZodIssueCode.custom,
          message: 'Favor ingrese el nombre del titular.',
        });
      }
      if (
        !val.isCashAccount &&
        val.bankInfo &&
        val.bankInfo?.accountNumber.length < 3
      ) {
        ctx.addIssue({
          path: ['bankInfo.accountNumber'],
          code: z.ZodIssueCode.custom,
          message: 'Favor ingrese el número de cuenta.',
        });
      }
    })
);

const defaultBankInfoData: FormBankInfo = {
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

export const defaultMoneyAccData: FormMoneyAccount = {
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
  bankInfo: defaultBankInfoData,
};
