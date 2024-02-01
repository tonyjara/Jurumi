import type { Imbursement } from "@prisma/client";
import {
  BankAccountType,
  BankDocType,
  BankNamesPy,
  Currency,
} from "@prisma/client";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { stringReqMinMax } from "../utils/ValidationHelpers";
import { defaultBankInfo, moneyReqTaxPayer } from "./moneyRequest.validate";

export type FormImbursement = Omit<
  Imbursement,
  | "amountInOtherCurrency"
  | "finalAmount"
  | "taxPayerId"
  | "imbursementProofId"
  | "invoiceFromOrgId"
> & {
  amountInOtherCurrency?: any;
  finalAmount?: any;
  imbursementProof: { imageName: string; url: string } | null;
  invoiceFromOrg: { imageName: string; url: string } | null;
  taxPayer: moneyReqTaxPayer;
};

export const validateImbursement: z.ZodType<FormImbursement> = z.lazy(() =>
  z.object({
    id: z.string(),
    wasCancelled: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date().nullable(),
    accountId: z.string(),
    updatedById: z.string().nullable(),
    concept: stringReqMinMax("Favor ingrese concepto del desembolso.", 2, 128),
    wasConvertedToOtherCurrency: z.boolean(),
    exchangeRate: z.number(),
    otherCurrency: z.nativeEnum(Currency),
    amountInOtherCurrency: z
      .any()
      .transform((value) => new Prisma.Decimal(value)),
    finalAmount: z.any().transform((value) => new Prisma.Decimal(value)),
    softDeleted: z.boolean(),
    archived: z.boolean(),
    finalCurrency: z.nativeEnum(Currency),
    projectId: z.string().nullable(),
    moneyAccountId: z
      .string({ invalid_type_error: "Favor seleccione una cuenta." })
      .min(2, "Favor seleccione una cuenta."),
    imbursementProof: z
      .object({
        imageName: z.string().min(1, "Favor suba la imágen de su comprobante"),
        url: z.string().min(1, "Favor suba la imágen de su comprobante"),
      })
      .nullable(),
    invoiceFromOrg: z
      .object({
        imageName: z.string(),
        url: z.string(),
      })
      .nullable(),
    taxPayer: z.object({
      //Only make required through superRefine
      /* razonSocial: z.string(), */
      /* ruc: z.string(), */
      id: z.string().nullable(),
      razonSocial: z.string({
        required_error: "Favor ingrese el documento del contribuyente.",
        invalid_type_error: "Favor ingrese el documento del contribuyente.",
      }),
      ruc: z.string({
        required_error: "Favor ingrese el documento del contribuyente.",
        invalid_type_error: "Favor ingrese el documento del contribuyente.",
      }),
      bankInfo: z
        .object({
          bankName: z.nativeEnum(BankNamesPy, {
            invalid_type_error: "Favor ingrese el banco.",
          }),
          accountNumber: z.string(),
          ownerName: z.string(),
          ownerDocType: z.nativeEnum(BankDocType),
          ownerDoc: z.string(),
          taxPayerId: z.string(),
          type: z.nativeEnum(BankAccountType),
        })
        .nullable(),
    }),
  }),
);

export const defaultImbursementData: FormImbursement = {
  id: "",
  createdAt: new Date(),
  updatedAt: null,
  accountId: "",
  updatedById: null,
  wasCancelled: false,
  concept: "",
  wasConvertedToOtherCurrency: true,
  exchangeRate: 0,
  otherCurrency: "USD",
  amountInOtherCurrency: new Prisma.Decimal(0),
  finalCurrency: "PYG",
  finalAmount: new Prisma.Decimal(1),
  archived: false,
  softDeleted: false,
  moneyAccountId: "",
  projectId: null,
  taxPayer: {
    id: null,
    razonSocial: "",
    ruc: "",
    bankInfo: defaultBankInfo,
  },
  imbursementProof: { url: "", imageName: "" },
  invoiceFromOrg: { url: "", imageName: "" },
};
