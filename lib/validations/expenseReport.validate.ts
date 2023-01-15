import type { ExpenseReport } from '@prisma/client';
import { Currency } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { stringReqMinMax } from '../utils/ValidationHelpers';

type withMoney = Omit<ExpenseReport, 'amountSpent' | 'taxPayerId'> & {
  amountSpent?: any;
};

export interface FormExpenseReport extends withMoney {
  searchableImage: { imageName: string; url: string } | null;
  taxPayer: { razonSocial: string; ruc: string };
}

export const validateExpenseReport: z.ZodType<FormExpenseReport> = z.lazy(() =>
  z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date().nullable(),
    facturaNumber: stringReqMinMax(
      'Favor ingrese el número de factura',
      13,
      13
    ),
    currency: z.nativeEnum(Currency),
    comments: z.string().max(128, 'Has excedido el límite de caractéres (128)'),
    amountSpent: z.any().transform((value) => new Prisma.Decimal(value)),
    moneyRequestId: z.string().min(1),
    accountId: z.string(),
    projectId: z.string({ invalid_type_error: 'Favor seleccione un proyecto' }),
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

export const defaultExpenseReportData: FormExpenseReport = {
  id: '',
  createdAt: new Date(),
  updatedAt: null,
  facturaNumber: '',
  amountSpent: new Prisma.Decimal(0),
  moneyRequestId: '',
  currency: 'PYG',
  projectId: '',
  comments: '',
  accountId: '',
  taxPayer: { razonSocial: '', ruc: '' },
  searchableImage: { url: '', imageName: '' },
};
