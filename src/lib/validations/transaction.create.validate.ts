import type { Transaction } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { Currency } from '@prisma/client';
import { z } from 'zod';

type withMoney = Omit<
  Transaction,
  | 'openingBalance'
  | 'transactionAmount'
  | 'currency'
  | 'moneyAccountId'
  | 'transactionProofUrl'
> & {
  openingBalance?: any;
};

export interface TransactionField {
  currency: Currency;
  transactionAmount?: any;
  moneyAccountId: string;
  transactionProofUrl: string;
}
export interface FormTransaction extends withMoney {
  transactions: TransactionField[];
}

export const validateTransactionCreate: z.ZodType<FormTransaction> = z.lazy(
  () =>
    z
      .object({
        transactions: z.array(
          z.object({
            currency: z.nativeEnum(Currency),
            transactionAmount: z
              .any()
              .transform((value) => new Prisma.Decimal(value)),
            moneyAccountId: z
              .string({
                required_error:
                  'Favor seleccione una cuenta de donde extraer el dinero.',
              })
              .min(
                2,
                'Favor seleccione una cuenta de donde extraer el dinero.'
              ),
            transactionProofUrl: z.string(),
          })
        ),
        id: z.number().int(),
        createdAt: z.date(),
        updatedAt: z.date().nullable(),
        accountId: z.string(),
        updatedById: z.string().nullable(),
        openingBalance: z.any().transform((value) => new Prisma.Decimal(value)),

        moneyRequestId: z.string().nullable(),
        expenseReturnId: z.string().nullable(),
        imbursementId: z.string().nullable(),
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

export type validateTransactionCreateData = z.infer<
  typeof validateTransactionCreate
>;

export const defaultTransactionCreateValues: validateTransactionCreateData = {
  id: 0,
  createdAt: new Date(),
  updatedAt: null,
  accountId: '',
  updatedById: null,
  transactions: [
    {
      currency: 'PYG',
      transactionAmount: new Prisma.Decimal(0),
      moneyAccountId: '',
      transactionProofUrl: '',
    },
  ],
  openingBalance: new Prisma.Decimal(0),
  moneyRequestId: null,
  imbursementId: null,
  expenseReturnId: null,
};
