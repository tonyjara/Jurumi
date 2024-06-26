import type { Transaction } from "@prisma/client";
import { TransactionType } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { Currency } from "@prisma/client";
import { z } from "zod";

export type FormTransactionEdit = Omit<
  Transaction,
  "openingBalance" | "transactionAmount" | "currentBalance"
> & {
  openingBalance?: any;
  transactionAmount?: any;
  currentBalance?: any;
  searchableImage: { imageName: string; url: string } | null;
};

export const validateTransactionEdit: z.ZodType<FormTransactionEdit> = z.lazy(
  () =>
    z
      .object({
        id: z.number().int(),
        createdAt: z.date(),
        updatedAt: z.date().nullable(),
        operationDate: z.date().nullable(),
        accountId: z.string(),
        concept: z.string(),
        updatedById: z.string().nullable(),
        currency: z.nativeEnum(Currency),
        isCancellation: z.boolean(),
        openingBalance: z.any().transform((value) => new Prisma.Decimal(value)),
        currentBalance: z.any().transform((value) => new Prisma.Decimal(value)),
        transactionAmount: z
          .any()
          .transform((value) => new Prisma.Decimal(value)),
        moneyRequestId: z.string().nullable(),
        expenseReportId: z.string().nullable(),
        moneyAccountOffsetId: z.string().nullable(),
        projectId: z.string().nullable(),
        expenseReturnId: z.string().nullable(),
        membershipId: z.string().nullable(),
        membershipPaymentRequestId: z.string().nullable(),
        costCategoryId: z.string().nullable(),
        imbursementId: z.string().nullable(),
        cancellationId: z.number().nullable(),
        transactionType: z.nativeEnum(TransactionType),
        wasConvertedToOtherCurrency: z.boolean(),
        exchangeRate: z.number(),

        moneyAccountId: z
          .string({
            required_error:
              "Favor seleccione una cuenta de donde extraer el dinero.",
          })
          .min(2, "Favor seleccione una cuenta de donde extraer el dinero."),
        searchableImage: z
          .object({
            imageName: z
              .string()
              .min(1, "Favor suba la imágen de su comprobante"),
            url: z.string().min(1, "Favor suba la imágen de su comprobante"),
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
      }),
);

export const defaultTransactionEditValues: FormTransactionEdit = {
  id: 0,
  createdAt: new Date(),
  updatedAt: null,
  concept: "",
  accountId: "",
  updatedById: null,
  moneyAccountOffsetId: null,
  currency: "PYG",
  transactionAmount: new Prisma.Decimal(0),
  currentBalance: new Prisma.Decimal(0),
  moneyAccountId: "",
  operationDate: null,
  openingBalance: new Prisma.Decimal(0),
  moneyRequestId: null,
  membershipPaymentRequestId: null,
  membershipId: null,
  projectId: null,
  costCategoryId: null,
  imbursementId: null,
  expenseReturnId: null,
  isCancellation: false,
  cancellationId: null,
  exchangeRate: 7000,
  wasConvertedToOtherCurrency: false,
  transactionType: "MONEY_ACCOUNT",
  searchableImage: { url: "", imageName: "" },
  expenseReportId: null,
};
