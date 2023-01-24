import type { Transaction } from '@prisma/client';
import { TransactionType } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { Currency } from '@prisma/client';
import { z } from 'zod';

type withMoney = Omit<
  Transaction,
  | 'openingBalance'
  | 'transactionAmount'
  | 'currentBalance'
  | 'currency'
  | 'moneyAccountId'
  | 'transactionProofUrl'
  | 'costCategoryId'
> & {
  openingBalance?: any;
  currentBalance?: any;
  searchableImage: { imageName: string; url: string } | null;
};

export interface TransactionField {
  currency: Currency;
  transactionAmount?: any;
  moneyAccountId: string;
  transactionProofUrl: string;
}
export interface FormTransactionCreate extends withMoney {
  transactions: TransactionField[];
}

export const validateTransactionCreate: z.ZodType<FormTransactionCreate> =
  z.lazy(() =>
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
        isCancellation: z.boolean(),
        projectId: z.string().nullable(),
        updatedById: z.string().nullable(),
        openingBalance: z.any().transform((value) => new Prisma.Decimal(value)),
        currentBalance: z.any().transform((value) => new Prisma.Decimal(value)),
        cancellationId: z.number().nullable(),
        moneyRequestId: z.string().nullable(),
        expenseReturnId: z.string().nullable(),
        expenseReportId: z.string().nullable(),
        transactionType: z.nativeEnum(TransactionType),

        imbursementId: z.string().nullable(),
        searchableImage: z
          .object({
            imageName: z.string(),
            url: z.string(),
          })
          .nullable(),
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

export const defaultTransactionCreateData: FormTransactionCreate = {
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
  transactionType: 'MONEY_ACCOUNT',
  openingBalance: new Prisma.Decimal(0),
  currentBalance: new Prisma.Decimal(0),
  moneyRequestId: null,
  imbursementId: null,
  expenseReturnId: null,
  cancellationId: null,
  projectId: null,
  isCancellation: false,
  searchableImage: { url: '', imageName: '' },
  expenseReportId: null,
};
