import type { Imbursement } from '@prisma/client';
import { Currency } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { stringReqMinMax } from '../utils/ValidationHelpers';

export type FormImbursement = Omit<
  Imbursement,
  | 'amountInOtherCurrency'
  | 'finalAmount'
  | 'taxPayerId'
  | 'imbursementProofId'
  | 'invoiceFromOrgId'
> & {
  amountInOtherCurrency?: any;
  finalAmount?: any;
  imbursementProof: { imageName: string; url: string } | null;
  invoiceFromOrg: { imageName: string; url: string } | null;
  taxPayer: { razonSocial: string; ruc: string };
};

export const validateImbursement: z.ZodType<FormImbursement> = z.lazy(() =>
  z.object({
    id: z.string(),
    wasCancelled: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date().nullable(),
    accountId: z.string(),
    updatedById: z.string().nullable(),
    concept: stringReqMinMax('Favor ingrese concepto del desembolso.', 2, 128),
    wasConvertedToOtherCurrency: z.boolean(),
    exchangeRate: z.number(),
    otherCurrency: z.nativeEnum(Currency),
    amountInOtherCurrency: z
      .any()
      .transform((value) => new Prisma.Decimal(value)),
    finalAmount: z.any().transform((value) => new Prisma.Decimal(value)),
    softDeleted: z.boolean(),
    archived: z.boolean(),
    finalCurrency: z.nativeEnum(Currency),
    projectId: z.string().nullable(),
    moneyAccountId: z
      .string({ invalid_type_error: 'Favor seleccione una cuenta.' })
      .min(2, 'Favor seleccione una cuenta.'),
    imbursementProof: z
      .object({
        imageName: z.string().min(1, 'Favor suba la imágen de su comprobante'),
        url: z.string().min(1, 'Favor suba la imágen de su comprobante'),
      })
      .nullable(),
    invoiceFromOrg: z
      .object({
        imageName: z.string(),
        url: z.string(),
      })
      .nullable(),
    taxPayer: z.object({
      razonSocial: stringReqMinMax(
        'Favor ingrese la razon del contribuyente',
        2,
        128
      ),
      ruc: stringReqMinMax('Favor ingrese el ruc del contribuyente', 5, 20),
    }),
  })
);

export const defaultImbursementData: FormImbursement = {
  id: '',
  createdAt: new Date(),
  updatedAt: null,
  accountId: '',
  updatedById: null,
  wasCancelled: false,
  concept: '',
  wasConvertedToOtherCurrency: true,
  exchangeRate: 0,
  otherCurrency: 'USD',
  amountInOtherCurrency: new Prisma.Decimal(0),
  finalCurrency: 'PYG',
  finalAmount: new Prisma.Decimal(1),
  archived: false,
  softDeleted: false,
  moneyAccountId: '',
  projectId: null,
  taxPayer: { razonSocial: '', ruc: '' },
  imbursementProof: { url: '', imageName: '' },
  invoiceFromOrg: { url: '', imageName: '' },
};
