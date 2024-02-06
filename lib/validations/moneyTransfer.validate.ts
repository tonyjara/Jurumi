import { Currency, Prisma } from "@prisma/client";
import { z } from "zod";

export interface FormMoneyAccountTransfer {
  fromAccountId: string;
  fromCurrency: Currency | null;
  toCurrency: Currency | null;
  toAccountId: string;
  amount?: any;
  exchangeRate: number;
  exchangeIsDifferentCurrency: boolean;
  searchableImage: { imageName: string; url: string } | null;
}

export const validateMoneyTransfer: z.ZodType<FormMoneyAccountTransfer> =
  z.lazy(() =>
    z
      .object({
        fromAccountId: z
          .string({ required_error: "Favor seleccione una cuenta de origen." })
          .min(2, "Favor seleccione una cuenta de origen."),
        fromCurrency: z.nativeEnum(Currency),
        toAccountId: z
          .string({ required_error: "Favor seleccione una cuenta de destino." })
          .min(2, "Favor seleccione una cuenta de destino."),
        toCurrency: z.nativeEnum(Currency),
        amount: z.any().transform((value) => new Prisma.Decimal(value)),
        exchangeRate: z.number(),

        exchangeIsDifferentCurrency: z.boolean(),
        searchableImage: z
          .object({
            imageName: z.string(),
            url: z.string(),
          })
          .nullable(),
      })
      .superRefine((val, ctx) => {
        if (val.amount.toNumber() <= 0) {
          ctx.addIssue({
            path: ["amount"],
            code: z.ZodIssueCode.custom,
            message: "El monto debe ser mayor a 0",
          });
        }

        if (val.exchangeIsDifferentCurrency && val.exchangeRate <= 0) {
          ctx.addIssue({
            path: ["exchangeRate"],
            code: z.ZodIssueCode.custom,
            message: "La tasa de cambio debe ser mayor a 0",
          });
        }
      }),
  );

export const defaultMoneyAccTransferData: FormMoneyAccountTransfer = {
  fromAccountId: "",
  fromCurrency: "PYG",
  toAccountId: "",
  toCurrency: "PYG",
  amount: new Prisma.Decimal(0),
  exchangeRate: 0,
  exchangeIsDifferentCurrency: false,
  searchableImage: null,
};
