import { Currency, Prisma, searchableImage } from "@prisma/client";
import * as z from "zod";
import { stringReqMinMax } from "../utils/ValidationHelpers";

export type FormSearchableImageEdit = Omit<
  searchableImage,
  | "amount"
  | "url"
  | "imageName"
  | "imbursementId"
  | "expenseReportId"
  | "expenseReturnId"
  | "moneyRequestId"
  | "transactionId"
  | "accountId"
> & {
  amount?: any;
};

export const validateSearchableImageEdit: z.ZodType<FormSearchableImageEdit> =
  z.lazy(() =>
    z.object({
      id: z.string(),
      createdAt: z.date(),
      updatedAt: z.date().nullable(),
      text: z
        .string({ required_error: "Favor ingrese un nombre para su org." })
        .max(1024, { message: "Has excedido el límite de caractéres (1024)" }),
      facturaNumber: stringReqMinMax(
        "Favor ingrese el número de factura",
        13,
        13
      ),
      currency: z.nativeEnum(Currency),
      amount: z.any().transform((value) => new Prisma.Decimal(value)),
    })
  );

export const defaultSeachableImageEditData: FormSearchableImageEdit = {
  id: "",
  createdAt: new Date(),
  updatedAt: null,
  text: "",
  facturaNumber: "",
  currency: "PYG",
  amount: new Prisma.Decimal(0),
};
