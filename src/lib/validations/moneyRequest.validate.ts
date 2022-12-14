import type { MoneyRequest } from '@prisma/client';
import { MoneyRequestStatus, MoneyRequestType } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { Currency } from '@prisma/client';
import { z } from 'zod';

const stringReqMinMax = (reqText: string, min: number, max: number) =>
  z
    .string({ required_error: reqText })
    .min(min, `El campo debe tener al menos (${min}) caractéres.`)
    .max(max, `Has superado el límite de caractérs (${max})`);

type withMoney = Omit<MoneyRequest, 'amountRequested'> & {
  amountRequested?: any;
};
interface withExpenseReport extends withMoney {
  facturaNumber?: string;
  costCategories?: string[];
  facturaPictureUrl?: string;
  taxPayerId?: string;
}

export const validateMoneyRequest: z.ZodType<withExpenseReport> = z.lazy(() =>
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
      archived: z.boolean(),
      softDeleted: z.boolean(),
      rejectionMessage: z.string(),
      organizationId: z.string().min(1, 'Favor seleccione una organización.'),
      facturaNumber: z.string(),
      taxPayerId: z.string(),
      costCategories: z.string().array(),
      facturaPictureUrl: z.string(),
    })
    .superRefine((val, ctx) => {
      if (val.status === 'REJECTED' && val.rejectionMessage.length < 6) {
        ctx.addIssue({
          path: ['rejectionMessage'],
          code: z.ZodIssueCode.custom,
          message: 'Favor justifique el rechazo en al menos 6 caractéres.',
        });
      }
      if (val.moneyRequestType === 'REIMBURSMENT_ORDER') {
        if (val.facturaNumber.length < 5) {
          ctx.addIssue({
            path: ['facturaNumber'],
            code: z.ZodIssueCode.custom,
            message: 'Favor ingrese un número de factura.',
          });
        }
        if (val.facturaPictureUrl.length < 5) {
          ctx.addIssue({
            path: ['facturaPictureUrl'],
            code: z.ZodIssueCode.custom,
            message: 'Favor suba un comprobante de compra.',
          });
        }
        if (val.taxPayerId.length < 5) {
          ctx.addIssue({
            path: ['taxPayerId'],
            code: z.ZodIssueCode.custom,
            message: 'Favor seleccione un contribuyente.',
          });
        }
      }
    })
);

export type moneyRequestValidateData = z.infer<typeof validateMoneyRequest>;

export const defaultMoneyRequestValues: moneyRequestValidateData = {
  id: '',
  createdAt: new Date(),
  updatedAt: null,
  description: '',
  status: 'PENDING',
  moneyRequestType: 'FUND_REQUEST',
  currency: 'PYG',
  amountRequested: new Prisma.Decimal(0),
  accountId: '',
  projectId: null,
  archived: false,
  softDeleted: false,
  rejectionMessage: '',
  organizationId: '',
  facturaNumber: '',
  facturaPictureUrl: '',
  costCategories: [],
  taxPayerId: '',
};
