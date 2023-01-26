import type { MoneyRequest, TaxPayerBankInfo } from '@prisma/client';
import { BankAccountType } from '@prisma/client';
import { BankDocType, BankNamesPy } from '@prisma/client';
import { MoneyRequestStatus, MoneyRequestType } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { Currency } from '@prisma/client';
import { z } from 'zod';
import { stringReqMinMax } from '../utils/ValidationHelpers';

export type moneyReqTaxPayer = {
  razonSocial: string;
  ruc: string;
  bankInfo: TaxPayerBankInfo;
};

export type FormMoneyRequest = Omit<
  MoneyRequest,
  'amountRequested' | 'taxPayerId'
> & {
  amountRequested?: any;
  taxPayer: moneyReqTaxPayer;
};

export const validateMoneyRequest: z.ZodType<FormMoneyRequest> = z.lazy(() =>
  z
    .object({
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
      accountId: z.string(),
      projectId: z.string().nullable(),
      costCategoryId: z.string().nullable(),
      archived: z.boolean(),
      softDeleted: z.boolean(),
      rejectionMessage: z.string(),
      organizationId: z.string().min(1, 'Favor seleccione una organización.'),
      wasCancelled: z.boolean(),
      taxPayer: z.object({
        razonSocial: z.string(),
        ruc: z.string(),
        bankInfo: z.object({
          bankName: z.nativeEnum(BankNamesPy),
          accountNumber: z.string(),
          ownerName: z.string(),
          ownerDocType: z.nativeEnum(BankDocType),
          ownerDoc: z.string(),
          taxPayerId: z.string(),
          type: z.nativeEnum(BankAccountType),
        }),
      }),
    })
    .superRefine((val, ctx) => {
      if (val.status === 'REJECTED' && val.rejectionMessage.length < 6) {
        ctx.addIssue({
          path: ['rejectionMessage'],
          code: z.ZodIssueCode.custom,
          message: 'Favor justifique el rechazo en al menos 6 caractéres.',
        });
      }
      if (
        (val.moneyRequestType === 'MONEY_ORDER' ||
          val.moneyRequestType === 'REIMBURSMENT_ORDER') &&
        val.taxPayer.razonSocial.length < 2
      ) {
        ctx.addIssue({
          path: ['taxPayer.ruc'],
          code: z.ZodIssueCode.custom,
          message: 'Favor ingrese los datos del beneficiario.',
        });
      }
      if (val.amountRequested.toNumber() <= 1) {
        ctx.addIssue({
          path: ['amountRequested'],
          code: z.ZodIssueCode.custom,
          message: 'El monto debe ser mayor a 1.',
        });
      }
    })
);

export const defaultMoneyRequestData: FormMoneyRequest = {
  id: '',
  createdAt: new Date(),
  updatedAt: null,
  description: '',
  status: 'PENDING',
  moneyRequestType: 'FUND_REQUEST',
  currency: 'PYG',
  amountRequested: new Prisma.Decimal(0),
  costCategoryId: null,
  accountId: '',
  projectId: null,
  archived: false,
  softDeleted: false,
  rejectionMessage: '',
  organizationId: '',
  wasCancelled: false,
  taxPayer: {
    razonSocial: '',
    ruc: '',
    bankInfo: {
      bankName: 'BANCOP',
      accountNumber: '',
      ownerName: '',
      ownerDocType: 'CI',
      ownerDoc: '',
      taxPayerId: '',
      type: 'SAVINGS',
    },
  },
};
