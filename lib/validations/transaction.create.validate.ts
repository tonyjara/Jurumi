//@ts-ignore
const faker = (await import("@faker-js/faker")).faker;
import type { MoneyRequest, Transaction } from "@prisma/client";
import { TransactionType } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { Currency } from "@prisma/client";
import { z } from "zod";
import { v4 as uuidV4 } from "uuid";

type withMoney = Omit<
  Transaction,
  | "openingBalance"
  | "transactionAmount"
  | "currentBalance"
  | "currency"
  | "moneyAccountId"
  | "wasConvertedToOtherCurrency"
  | "exchangeRate"
> & {
  openingBalance?: any;
  currentBalance?: any;
  searchableImage: { imageName: string; url: string } | null;
};

export interface TransactionField {
  currency: Currency;
  transactionAmount?: any;
  moneyAccountId: string;
  wasConvertedToOtherCurrency: boolean;
  exchangeRate: number;
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
                  "Favor seleccione una cuenta de donde extraer el dinero.",
              })
              .min(
                2,
                "Favor seleccione una cuenta de donde extraer el dinero.",
              ),
            wasConvertedToOtherCurrency: z.boolean(),
            exchangeRate: z.number(),
          }),
        ),
        id: z.number().int(),
        createdAt: z.date(),
        updatedAt: z.date().nullable(),
        accountId: z.string(),
        moneyAccountOffsetId: z.string().nullable(),
        isCancellation: z.boolean(),
        projectId: z.string().nullable(),
        updatedById: z.string().nullable(),
        openingBalance: z.any().transform((value) => new Prisma.Decimal(value)),
        currentBalance: z.any().transform((value) => new Prisma.Decimal(value)),
        cancellationId: z.number().nullable(),
        moneyRequestId: z.string().nullable(),
        costCategoryId: z.string().nullable(),
        expenseReturnId: z.string().nullable(),
        expenseReportId: z.string().nullable(),
        transactionType: z.nativeEnum(TransactionType),

        imbursementId: z.string().nullable(),
        membershipId: z.string().nullable(),
        membershipPaymentRequestId: z.string().nullable(),
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
            path: ["id"],
            code: z.ZodIssueCode.custom,
            message:
              "La transacción debe estar relacionada con un desembolso, retorno o una solicitud.",
          });
        }
        val.transactions.forEach((transaction, index) => {
          if (transaction.transactionAmount.toNumber() <= 0) {
            ctx.addIssue({
              path: [`transactions.${index}.transactionAmount`],
              code: z.ZodIssueCode.custom,
              message: "Favor ingrese un monto mayor a 0.",
            });
          }
          if (
            transaction.wasConvertedToOtherCurrency &&
            transaction.exchangeRate <= 0
          ) {
            ctx.addIssue({
              path: [`transactions.${index}.exchangeRate`],
              code: z.ZodIssueCode.custom,
              message: "Favor ingrese una tasa de cambio mayor a 0.",
            });
          }
        });
      }),
  );

export const defaultTransactionCreateData: FormTransactionCreate = {
  id: 0,
  createdAt: new Date(),
  updatedAt: null,
  accountId: "",
  updatedById: null,
  transactions: [
    {
      currency: "PYG",
      transactionAmount: new Prisma.Decimal(0),
      moneyAccountId: "",
      exchangeRate: 7000,
      wasConvertedToOtherCurrency: false,
    },
  ],
  transactionType: "MONEY_ACCOUNT",
  moneyAccountOffsetId: null,
  openingBalance: new Prisma.Decimal(0),
  currentBalance: new Prisma.Decimal(0),
  moneyRequestId: null,
  imbursementId: null,
  membershipId: null,
  membershipPaymentRequestId: null,
  expenseReturnId: null,
  cancellationId: null,
  costCategoryId: null,
  projectId: null,
  isCancellation: false,
  searchableImage: { url: "", imageName: "" },
  expenseReportId: null,
};
export const transactionMock: (
  moneyReq: MoneyRequest & {
    transactions: Transaction[]; // only transactionAmount is selected
  },
  moneyAccOptions: (currency: Currency) =>
    | {
        value: string;
        label: string;
      }[]
    | undefined,
) => FormTransactionCreate = (
  { projectId, accountId, currency, id, costCategoryId, amountRequested },
  moneyAccOptions,
) => {
  const imageName = uuidV4();
  const x: FormTransactionCreate = {
    transactions: [
      {
        transactionAmount: amountRequested,
        //@ts-ignore
        moneyAccountId: moneyAccOptions(currency)[0]?.value ?? "",
        currency,
        exchangeRate: 7000,
        wasConvertedToOtherCurrency: false,
      },
    ],
    id: 0,
    createdAt: new Date(),
    updatedAt: null,
    accountId,
    updatedById: null,
    moneyAccountOffsetId: null,
    openingBalance: new Prisma.Decimal(
      faker.commerce.price({ min: 1000000, max: 3000000 }),
    ),
    currentBalance: new Prisma.Decimal(0),
    isCancellation: false,
    moneyRequestId: id,
    imbursementId: null,
    expenseReturnId: null,
    cancellationId: null,
    projectId,
    membershipId: null,
    membershipPaymentRequestId: null,
    costCategoryId,
    expenseReportId: null,
    transactionType: "MONEY_ACCOUNT",
    searchableImage: {
      url: "https://statingstoragebrasil.blob.core.windows.net/clbmbqh3o00008x98b3v23a7e/2c96c577-01a6-4a42-8681-907593b087aa",
      imageName,
    },
  };
  return x;
};
