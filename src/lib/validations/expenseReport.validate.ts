import type { ExpenseReport } from '@prisma/client';
import { Currency } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const stringReqMinMax = (reqText: string, min: number, max: number) =>
  z
    .string({ required_error: reqText })
    .min(min, `El campo debe tener al menos (${min}) caractéres.`)
    .max(max, `Has superado el límite de caractérs (${max})`);

type withMoney = Omit<ExpenseReport, 'amountSpent' | 'taxPayerId'> & {
  amountSpent?: any;
};

interface FormExpenseReport extends withMoney {
  facturaPictureUrl: string;
  imageName: string;
  taxPayerRuc: string;
  taxPayerRazonSocial: string;
}

export const validateExpenseReport: z.ZodType<FormExpenseReport> = z.lazy(() =>
  z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date().nullable(),
    facturaNumber: stringReqMinMax(
      'Favor ingrese el número de factura',
      10,
      14
    ),
    currency: z.nativeEnum(Currency),
    comments: z.string().max(128, 'Has excedido el límite de caractéres (128)'),
    amountSpent: z.any().transform((value) => new Prisma.Decimal(value)),
    moneyRequestId: z.string().min(1),
    accountId: z.string(),
    projectId: z.string(),
    costCategoryId: z.string().nullable(),
    facturaPictureUrl: stringReqMinMax(
      'Favor suba la imágen de su comprobante',
      1,
      500
    ),
    imageName: z.string(),
    taxPayerRuc: stringReqMinMax('Favor elija al contribuyente', 2, 128),
    taxPayerRazonSocial: stringReqMinMax(
      'Favor elija al contribuyente',
      2,
      128
    ),
  })
);

export type expenseReportValidateType = z.infer<typeof validateExpenseReport>;

export const defaultExpenseReportData: expenseReportValidateType = {
  id: '',
  createdAt: new Date(),
  updatedAt: null,
  facturaNumber: '',
  amountSpent: new Prisma.Decimal(0),
  moneyRequestId: '',
  costCategoryId: '',
  facturaPictureUrl: '',
  currency: 'PYG',
  imageName: '',
  taxPayerRuc: '',
  taxPayerRazonSocial: '',
  projectId: '',
  comments: '',
  accountId: '',
};
