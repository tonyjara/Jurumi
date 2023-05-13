import type { MoneyAccountOffset } from "@prisma/client";
import { Currency } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export type FormMoneyAccounOffset = Omit<
  MoneyAccountOffset,
  "offsettedAmount" | "previousBalance"
> & {
  offsettedAmount?: any;
  previousBalance?: any;
};

export const validateMoneyAccountOffset: z.ZodType<FormMoneyAccounOffset> =
  z.lazy(() =>
    z.object({
      id: z.string(),
      createdAt: z.date(),
      updatedAt: z.date().nullable(),
      wasCancelled: z.boolean(),
      currency: z.nativeEnum(Currency),
      offsettedAmount: z.any().transform((value) => new Prisma.Decimal(value)),
      previousBalance: z.any().transform((value) => new Prisma.Decimal(value)),
      offsetJustification: z
        .string()
        .min(
          10,
          "Favor justificar el motivo del ajuste con al menos 10 caractéres."
        ),
      moneyAccountId: z.string().min(2),
      accountId: z.string(),
    })
  );

export const defaultMoneyAccountOffset: FormMoneyAccounOffset = {
  id: "",
  createdAt: new Date(),
  updatedAt: null,
  offsettedAmount: new Prisma.Decimal(0),
  offsetJustification: "",
  moneyAccountId: "",
  currency: "PYG",
  accountId: "",
  wasCancelled: false,
  previousBalance: new Prisma.Decimal(0),
};
