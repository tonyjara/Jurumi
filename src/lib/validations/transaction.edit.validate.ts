import type { Transaction } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { Currency } from '@prisma/client';
import { z } from 'zod';

type withMoney = Omit<Transaction, 'openingBalance' | 'transactionAmount'> & {
  openingBalance?: any;
  transactionAmount?: any;
};

export const validateTransactionEdit: z.ZodType<withMoney> = z.lazy(() =>
  z
    .object({
      id: z.number().int(),
      createdAt: z.date(),
      updatedAt: z.date().nullable(),
      accountId: z.string(),
      updatedById: z.string().nullable(),
      currency: z.nativeEnum(Currency),
      openingBalance: z.any().transform((value) => new Prisma.Decimal(value)),
      transactionAmount: z
        .any()
        .transform((value) => new Prisma.Decimal(value)),
      moneyRequestId: z.string().nullable(),
      expenseReturnId: z.string().nullable(),
      imbursementId: z.string().nullable(),
      moneyAccountId: z
        .string({
          required_error:
            'Favor seleccione una cuenta de donde extraer el dinero.',
        })
        .min(2, 'Favor seleccione una cuenta de donde extraer el dinero.'),
    })
    .superRefine((val, ctx) => {
      if (!(val.expenseReturnId || val.imbursementId || val.moneyRequestId)) {
        ctx.addIssue({
          path: ['id'],
          code: z.ZodIssueCode.custom,
          message:
            'La transacción debe estar relacionada con un desembolso, retorno o una solicitud.',
        });
      }
    })
);

export type validateTransactionEditData = z.infer<
  typeof validateTransactionEdit
>;

export const defaultTransactionEditValues: validateTransactionEditData = {
  id: 0,
  createdAt: new Date(),
  updatedAt: null,
  accountId: '',
  updatedById: null,
  currency: 'PYG',
  transactionAmount: new Prisma.Decimal(0),
  moneyAccountId: '',
  openingBalance: new Prisma.Decimal(0),
  moneyRequestId: null,
  imbursementId: null,
  expenseReturnId: null,
};
