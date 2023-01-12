import type { MoneyRequest } from '@prisma/client';
import { MoneyRequestStatus, MoneyRequestType } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { Currency } from '@prisma/client';
import { z } from 'zod';
import { stringReqMinMax } from '../utils/ValidationHelpers';

export type FormMoneyRequest = Omit<MoneyRequest, 'amountRequested'> & {
  amountRequested?: any;
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
      archived: z.boolean(),
      softDeleted: z.boolean(),
      rejectionMessage: z.string(),
      organizationId: z.string().min(1, 'Favor seleccione una organización.'),
      costCategoryId: z.string().nullable(),
    })
    .superRefine((val, ctx) => {
      if (val.status === 'REJECTED' && val.rejectionMessage.length < 6) {
        ctx.addIssue({
          path: ['rejectionMessage'],
          code: z.ZodIssueCode.custom,
          message: 'Favor justifique el rechazo en al menos 6 caractéres.',
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
  accountId: '',
  projectId: null,
  archived: false,
  softDeleted: false,
  rejectionMessage: '',
  organizationId: '',
  costCategoryId: null,
};
