import type { Imbursement } from '@prisma/client';
import { Currency } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { stringReqMinMax } from '../utils/ValidationHelpers';

export type FormImbursement = Omit<
  Imbursement,
  'amountInOtherCurrency' | 'finalAmount' | 'taxPayerId'
> & {
  amountInOtherCurrency?: any;
  finalAmount?: any;
  searchableImage: { imageName: string; url: string } | null;
  taxPayer: { razonSocial: string; ruc: string };
};

export const validateImbursement: z.ZodType<FormImbursement> = z.lazy(() =>
  z.object({
    id: z.string(),
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
    projectStageId: z.string().nullable(),
    projectId: z.string(),
    moneyAccountId: z.string().min(2, 'Favor seleccione una cuenta.'),
    searchableImage: z
      .object({
        imageName: z.string().min(1, 'Favor suba la imágen de su comprobante'),
        url: z.string().min(1, 'Favor suba la imágen de su comprobante'),
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
  concept: '',
  wasConvertedToOtherCurrency: true,
  exchangeRate: 0,
  otherCurrency: 'USD',
  amountInOtherCurrency: new Prisma.Decimal(0),
  finalCurrency: 'PYG',
  finalAmount: new Prisma.Decimal(1),
  archived: false,
  softDeleted: false,
  projectStageId: null,
  moneyAccountId: '',
  projectId: null,
  taxPayer: { razonSocial: '', ruc: '' },
  searchableImage: { url: '', imageName: '' },
};
