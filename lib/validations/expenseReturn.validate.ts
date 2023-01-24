import type { ExpenseReturn } from '@prisma/client';
import { Currency } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

type withMoney = Omit<ExpenseReturn, 'amountReturned'> & {
  amountReturned?: any;
};

export interface FormExpenseReturn extends withMoney {
  searchableImage: { imageName: string; url: string };
}

export const validateExpenseReturn: z.ZodType<FormExpenseReturn> = z.lazy(() =>
  z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date().nullable(),
    wasCancelled: z.boolean(),
    currency: z.nativeEnum(Currency),
    amountReturned: z.any().transform((value) => new Prisma.Decimal(value)),
    moneyAccountId: z.string().min(2),
    moneyRequestId: z.string().min(2, 'Favor seleccione una cuenta.'),
    accountId: z.string(),
    searchableImage: z.object({
      imageName: z.string().min(1, 'Favor suba la imágen de su comprobante'),
      url: z.string().min(1, 'Favor suba la imágen de su comprobante'),
    }),
  })
);

export const defaultExpenseReturn: FormExpenseReturn = {
  id: '',
  createdAt: new Date(),
  updatedAt: null,
  amountReturned: new Prisma.Decimal(0),
  moneyRequestId: '',
  currency: 'PYG',
  moneyAccountId: '',
  accountId: '',
  searchableImage: { url: '', imageName: '' },
  wasCancelled: false,
};
