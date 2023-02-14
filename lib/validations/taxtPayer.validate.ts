import type { TaxPayer, TaxPayerBankInfo } from '@prisma/client';
import { BankAccountType } from '@prisma/client';
import { BankDocType, BankNamesPy } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as z from 'zod';

export type FormTaxPayer = TaxPayer & {
  bankInfo: TaxPayerBankInfo | null;
};

export const validateTaxPayer: z.ZodType<FormTaxPayer> = z.lazy(() =>
  z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date().nullable(),
    createdById: z.string(),
    updatedById: z.string().nullable(),
    razonSocial: z
      .string()
      .min(3, 'Favor ingrese la razón social.')
      .max(128, 'Has excedido el límite de caractéres (128).'),
    ruc: z
      .string()
      .min(5, 'Favor ingrese el ruc.')
      .max(14, 'Has excedido el límite de caractéres (14).'),
    fantasyName: z.string().nullable(),
    archived: z.boolean(),
    softDeleted: z.boolean(),
    accountId: z.string().nullable(),
    bankInfo: z.object({
      bankName: z.nativeEnum(BankNamesPy),
      accountNumber: z.string(),
      ownerName: z.string(),
      ownerDocType: z.nativeEnum(BankDocType),
      ownerDoc: z.string(),
      taxPayerId: z.string(),
      type: z.nativeEnum(BankAccountType),
    }),
  })
);

export const defaultTaxPayer: FormTaxPayer = {
  id: '',
  createdAt: new Date(),
  updatedAt: null,
  createdById: '',
  updatedById: '',
  razonSocial: '',
  ruc: '',
  fantasyName: '',
  archived: false,
  softDeleted: false,
  accountId: '',
  bankInfo: {
    bankName: 'BANCOP',
    accountNumber: '',
    ownerName: '',
    ownerDocType: 'CI',
    ownerDoc: '',
    taxPayerId: '',
    type: 'CURRENT',
  },
};

export const FormTaxPayerMock = () => {
  const x: FormTaxPayer = {
    id: '',
    createdAt: new Date(),
    updatedAt: null,
    createdById: '',
    updatedById: '',
    razonSocial: faker.name.fullName(),
    ruc: faker.random.numeric(6) + '-' + faker.random.numeric(1),
    fantasyName: faker.name.fullName(),
    archived: false,
    softDeleted: false,
    accountId: '',
    bankInfo: {
      bankName: 'ITAU',
      accountNumber: faker.finance.account(),
      ownerName: faker.name.fullName(),
      ownerDocType: 'CI',
      ownerDoc: faker.finance.account(5),
      taxPayerId: '',
      type: 'CURRENT',
    },
  };
  return x;
};
