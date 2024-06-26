//@ts-ignore
const faker = (await import("@faker-js/faker")).faker;
import type { MoneyRequest, TaxPayerBankInfo } from "@prisma/client";
import { ApprovalStatus, BankAccountType } from "@prisma/client";
import { BankDocType, BankNamesPy } from "@prisma/client";
import { MoneyRequestStatus, MoneyRequestType } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { Currency } from "@prisma/client";
import { z } from "zod";
import { stringReqMinMax } from "../utils/ValidationHelpers";
import { v4 as uuidV4 } from "uuid";

interface UNSAFE_TaxPayerBankInfoCopy {
  bankName?: BankNamesPy | null;
  accountNumber?: string | null;
  taxPayerId?: string | null;
  ownerName?: string | null;
  ownerDocType?: BankDocType | null;
  ownerDoc?: string | null;
  type?: BankAccountType | null;
}

//Existe para validar upserTaxPayer en moneyRequest
export interface ValidMoneyReqTaxPayer {
  id: string | null;
  razonSocial: string;
  ruc: string;
  bankInfo: TaxPayerBankInfo | null;
}
export interface moneyReqTaxPayer {
  id?: string | null;
  razonSocial?: string;
  ruc?: string | null;
  bankInfo?: UNSAFE_TaxPayerBankInfoCopy | null;
}
export interface MoneyReqSearchableImage {
  imageName: string;
  url: string;
  facturaNumber: string | null;
  amount?: any;
  currency: Currency;
}
export enum moneyOrderNamingType {
  alPortador = "alPortador",
  withTaxPayer = "withTaxPayer",
}

export type FormMoneyRequest = Omit<
  MoneyRequest,
  "amountRequested" | "taxPayerId" | "taxPayer"
> & {
  amountRequested?: any;
  taxPayer?: moneyReqTaxPayer | null;
  searchableImages: MoneyReqSearchableImage[];
  namingType: moneyOrderNamingType; //For moneyOrders when no tax payer data is required. Otherwhise bank data is required in the superRefine
};

export const validateMoneyRequest: z.ZodType<FormMoneyRequest> = z.lazy(() =>
  z
    .object({
      id: z.string(),
      namingType: z.nativeEnum(moneyOrderNamingType, {
        required_error: "Favor seleccione un tipo de orden.",
      }),
      createdAt: z.date(),
      updatedAt: z.date().nullable(),
      operationDate: z.date().nullable(),
      description: stringReqMinMax(
        "Favor ingrese el concepto del desembolso.",
        6,
        512,
      ),
      status: z.nativeEnum(MoneyRequestStatus),
      approvalStatus: z.nativeEnum(ApprovalStatus),
      moneyRequestType: z.nativeEnum(MoneyRequestType),
      currency: z.nativeEnum(Currency),
      amountRequested: z.any().transform((value) => new Prisma.Decimal(value)),
      accountId: z.string(),
      comments: z
        .string()
        .max(256, "Has excedido el límite de caractéres (256)"),
      projectId: z.string().nullable(),
      costCategoryId: z.string().nullable(),
      archived: z.boolean(),
      softDeleted: z.boolean(),
      rejectionMessage: z.string(),
      organizationId: z.string().min(1, "Favor seleccione una organización."),
      wasCancelled: z.boolean(),
      moneyOrderNumber: z.number().nullable(),
      contractsId: z.number().nullable(),
      taxPayer: z
        .object({
          id: z.string().nullable().optional(),
          razonSocial: z.string().optional(),
          ruc: z.string().nullable().optional(),
          bankInfo: z
            .object({
              bankName: z.nativeEnum(BankNamesPy).nullable(),
              accountNumber: z.string().nullable(),
              taxPayerId: z.string().nullable().optional(),
              ownerName: z.string().nullable(), //denominación
              ownerDocType: z.nativeEnum(BankDocType).nullable(),
              ownerDoc: z.string().nullable(),
              type: z.nativeEnum(BankAccountType).optional().nullable(),
            })
            .nullable()
            .optional(),
        })
        .nullable()
        .optional(),
      // For reimbursement order creation.
      facturaNumber: z.string().nullable(),
      searchableImages: z
        .object({
          imageName: z.string(),
          url: z.string(),
          facturaNumber: z.string(),
          amount: z.any().transform((value) => new Prisma.Decimal(value)),
          currency: z.nativeEnum(Currency),
        })
        .array(),
    })
    .superRefine((val, ctx) => {
      if (val.status === "REJECTED" && val.rejectionMessage.length < 6) {
        ctx.addIssue({
          path: ["rejectionMessage"],
          code: z.ZodIssueCode.custom,
          message: "Favor justifique el rechazo en al menos 6 caractéres.",
        });
      }

      if (
        val.moneyRequestType === "MONEY_ORDER" &&
        val.namingType === "withTaxPayer"
      ) {
        if (
          !val.taxPayer ||
          !val.taxPayer.razonSocial?.length ||
          !val.taxPayer?.ruc?.length
        ) {
          ctx.addIssue({
            path: ["taxPayer.ruc"],
            code: z.ZodIssueCode.custom,
            message: "Favor ingrese los datos del beneficiario.",
          });
        }
        if (!val.taxPayer?.bankInfo?.bankName?.length) {
          ctx.addIssue({
            path: ["taxPayer.bankInfo.bankName"],
            code: z.ZodIssueCode.custom,
            message: "Favor seleccione un banco",
          });
        }
        if (
          !val.taxPayer?.bankInfo?.ownerName?.length ||
          val.taxPayer.bankInfo.ownerName.length < 3
        ) {
          ctx.addIssue({
            path: ["taxPayer.bankInfo.ownerName"],
            code: z.ZodIssueCode.custom,
            message: "Favor ingrese la denominación.",
          });
        }
        if (
          !val.taxPayer?.bankInfo?.accountNumber?.length ||
          val.taxPayer.bankInfo.accountNumber.length < 3
        ) {
          ctx.addIssue({
            path: ["taxPayer.bankInfo.accountNumber"],
            code: z.ZodIssueCode.custom,
            message: "Favor ingrese el número de la cuenta bancaria.",
          });
        }
        if (!val.taxPayer?.bankInfo?.ownerDocType?.length) {
          ctx.addIssue({
            path: ["taxPayer.bankInfo.ownerDocType"],
            code: z.ZodIssueCode.custom,
            message: "Favor selecciones el tipo de documento",
          });
        }
        if (
          !val.taxPayer?.bankInfo?.ownerDoc?.length ||
          val.taxPayer.bankInfo.ownerDoc.length < 3
        ) {
          ctx.addIssue({
            path: ["taxPayer.bankInfo.ownerDoc"],
            code: z.ZodIssueCode.custom,
            message: "Favor ingrese el documento del titular.",
          });
        }
      }
      if (val.moneyRequestType !== "FUND_REQUEST") {
        if (val.moneyRequestType === "REIMBURSMENT_ORDER") {
          const currencySet = new Set();
          val.searchableImages.forEach((image, index) => {
            currencySet.add(image.currency);
            if (currencySet.size > 1) {
              ctx.addIssue({
                path: [`searchableImages.${index}.currency`],
                code: z.ZodIssueCode.custom,
                message: "Solo puedes tener un tipo de moneda por solicitud.",
              });
            }

            if (image.facturaNumber.length < 13) {
              ctx.addIssue({
                path: [`searchableImages.${index}.facturaNumber`],
                code: z.ZodIssueCode.custom,
                message: "Favor ingrese el número de factura.",
              });
            }

            if (!image.imageName.length) {
              ctx.addIssue({
                path: [`searchableImages.${index}.imageName`],
                code: z.ZodIssueCode.custom,
                message: "Favor suba un comprobante.",
              });
            }

            if (image.amount.toNumber() < 1) {
              ctx.addIssue({
                path: [`searchableImages.${index}.amount`],
                code: z.ZodIssueCode.custom,
                message: "El monto debe al menos 1.",
              });
            }
          });
        }
      }

      if (
        val.moneyRequestType !== "REIMBURSMENT_ORDER" &&
        val.amountRequested.toNumber() <= 1
      ) {
        ctx.addIssue({
          path: ["amountRequested"],
          code: z.ZodIssueCode.custom,
          message: "El monto debe ser mayor a 1.",
        });
      }
    }),
);

export const defaultReimbursementOrderSearchableImage: MoneyReqSearchableImage =
  {
    url: "",
    imageName: "",
    facturaNumber: "",
    amount: new Prisma.Decimal(0),
    currency: "PYG",
  };
export const defaultBankInfo: TaxPayerBankInfo = {
  bankName: "BANCOP",
  accountNumber: "",
  ownerName: "",
  ownerDocType: "CI",
  ownerDoc: "",
  taxPayerId: "",
  type: "SAVINGS",
};
export const defaultMoneyRequestData: FormMoneyRequest = {
  id: "",
  comments: "",
  namingType: moneyOrderNamingType.withTaxPayer,
  createdAt: new Date(),
  operationDate: new Date(),
  updatedAt: null,
  description: "",
  status: "PENDING",
  moneyRequestType: "FUND_REQUEST",
  currency: "PYG",
  amountRequested: new Prisma.Decimal(0),
  approvalStatus: "PENDING",
  costCategoryId: null,
  accountId: "",
  projectId: null,
  archived: false,
  softDeleted: false,
  rejectionMessage: "",
  organizationId: "",
  moneyOrderNumber: null,
  contractsId: null,
  wasCancelled: false,
  taxPayer: {
    id: null,
    razonSocial: "",
    ruc: "",
    bankInfo: defaultBankInfo,
  },
  facturaNumber: null,
  searchableImages: [defaultReimbursementOrderSearchableImage],
};

export const MockMoneyRequest = ({
  organizationId,
  moneyRequestType,
  projectId,
  contractsId,
}: {
  organizationId: string;
  projectId: string | null;
  moneyRequestType: MoneyRequestType;
  contractsId?: number | null;
}) => {
  const imageName = uuidV4();
  const imageName2 = uuidV4();
  const x: FormMoneyRequest = {
    id: "",
    namingType: moneyOrderNamingType.withTaxPayer,
    comments: faker.commerce.productDescription().substring(0, 200),
    moneyOrderNumber: null,
    createdAt: new Date(),
    operationDate: new Date(),
    approvalStatus: "PENDING",
    updatedAt: null,
    contractsId: contractsId ?? null,
    description: faker.commerce.productDescription().substring(0, 123),
    status: "PENDING",
    moneyRequestType,
    currency: "PYG",
    amountRequested: new Prisma.Decimal(
      faker.commerce.price({ min: 1000000, max: 3000000 }),
    ),
    accountId: "",
    costCategoryId: null,
    projectId,
    archived: false,
    softDeleted: false,
    rejectionMessage: "",
    wasCancelled: false,
    organizationId,
    taxPayer: {
      id: null,
      razonSocial: faker.company.name(),
      ruc: faker.string.numeric(6),
      bankInfo: {
        bankName: "BANCOP",
        accountNumber: faker.string.numeric(6),
        ownerName: faker.person.fullName(),
        ownerDocType: "CI",
        ownerDoc: faker.string.numeric(6),
        taxPayerId: "",
        type: "SAVINGS",
      },
    },
    facturaNumber: faker.string.numeric(13).toString(),
    searchableImages: [
      {
        url: "https://statingstoragebrasil.blob.core.windows.net/clbmbqh3o00008x98b3v23a7e/2c96c577-01a6-4a42-8681-907593b087aa",
        imageName,
        facturaNumber: faker.string.numeric(13).toString(),
        amount: new Prisma.Decimal(
          faker.commerce.price({ min: 1000000, max: 3000000 }),
        ),
        currency: "PYG",
      },
      {
        url: "https://statingstoragebrasil.blob.core.windows.net/clbmbqh3o00008x98b3v23a7e/2c96c577-01a6-4a42-8681-907593b087aa",
        imageName: imageName2,
        facturaNumber: faker.string.numeric(13).toString(),
        amount: new Prisma.Decimal(
          faker.commerce.price({ min: 1000000, max: 3000000 }),
        ),
        currency: "PYG",
      },
    ],
  };
  return x;
};
