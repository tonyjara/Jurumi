import {
    BankAccountType,
    BankDocType,
    BankNamesPy,
    ExpenseReport,
} from "@prisma/client";
import { v4 as uuidV4 } from "uuid";
import { Currency } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { stringReqMinMax } from "../utils/ValidationHelpers";
import { faker } from "@faker-js/faker";
import { moneyReqTaxPayer } from "./moneyRequest.validate";

type withMoney = Omit<ExpenseReport, "amountSpent" | "taxPayerId"> & {
    amountSpent?: any;
};

export interface FormExpenseReport extends withMoney {
    searchableImage: { imageName: string; url: string } | null;
    taxPayer: { razonSocial: string; ruc: string };
    //If present it will create a reimbursement req based on this expense report
    reimburseTo?: moneyReqTaxPayer | null;
    spentAmountIsGraterThanMoneyRequest?: boolean;
    pendingAmount?: any;
}

export const validateExpenseReport: z.ZodType<FormExpenseReport> = z
    .lazy(() =>
        z.object({
            id: z.string(),
            createdAt: z.date(),
            updatedAt: z.date().nullable(),
            facturaNumber: stringReqMinMax(
                "Favor ingrese el número de factura",
                13,
                13
            ).nullable(),
            wasConvertedToOtherCurrency: z.boolean(),
            exchangeRate: z.number(),
            concept: z
                .string({ required_error: "Favor ingrese un concepto" })
                .min(3, "Favor ingrese un concepto")
                .max(64, "Has excedido el límite de caractéres (64)"),
            currency: z.nativeEnum(Currency),
            comments: z
                .string()
                .max(128, "Has excedido el límite de caractéres (128)"),
            amountSpent: z.any().transform((value) => new Prisma.Decimal(value)),
            moneyRequestId: z.string().min(1),
            accountId: z.string(),
            wasCancelled: z.boolean(),
            projectId: z
                .string({ invalid_type_error: "Favor seleccione un proyecto" })
                .min(2, "Favor seleccione un proyecto"),
            searchableImage: z
                .object({
                    imageName: z
                        .string()
                        .min(1, "Favor suba la imágen de su comprobante"),
                    url: z.string().min(1, "Favor suba la imágen de su comprobante"),
                })
                .nullable(),
            costCategoryId: z.string().nullable(),
            taxPayer: z.object({
                razonSocial: stringReqMinMax(
                    "Favor ingrese la razon del contribuyente",
                    2,
                    128
                ),
                ruc: stringReqMinMax("Favor ingrese el ruc del contribuyente", 5, 20),
            }),
            pendingAmount: z.any().transform((value) => new Prisma.Decimal(value)),
            spentAmountIsGraterThanMoneyRequest: z.boolean(),
            reimburseTo: z
                .object({
                    razonSocial: z.string({
                        required_error: "Favor ingrese el documento del contribuyente.",
                    }),
                    ruc: z.string({
                        required_error: "Favor ingrese el documento del contribuyente.",
                    }),
                    bankInfo: z.object({
                        bankName: z.nativeEnum(BankNamesPy),
                        accountNumber: z.string(),
                        ownerName: z.string(),
                        ownerDocType: z.nativeEnum(BankDocType),
                        ownerDoc: z.string(),
                        taxPayerId: z.string(),
                        type: z.nativeEnum(BankAccountType),
                    }),
                })
                .nullable(),
        })
    )
    .superRefine((val, ctx) => {
        if (val.spentAmountIsGraterThanMoneyRequest) {
            if (
                !val.reimburseTo ||
                !val.reimburseTo.razonSocial?.length ||
                !val.reimburseTo.ruc.length
            ) {
                ctx.addIssue({
                    path: ["reimburseTo.ruc"],
                    code: z.ZodIssueCode.custom,
                    message: "Favor ingrese los datos del beneficiario.",
                });
            }

            if (
                !val.reimburseTo?.bankInfo.accountNumber.length ||
                val.reimburseTo.bankInfo.accountNumber.length < 3
            ) {
                ctx.addIssue({
                    path: ["reimburseTo.bankInfo.accountNumber"],
                    code: z.ZodIssueCode.custom,
                    message: "Favor ingrese el número de la cuenta bancaria.",
                });
            }
            if (
                !val.reimburseTo?.bankInfo.ownerName.length ||
                val.reimburseTo.bankInfo.ownerName.length < 3
            ) {
                ctx.addIssue({
                    path: ["reimburseTo.bankInfo.ownerName"],
                    code: z.ZodIssueCode.custom,
                    message: "Favor ingrese la denominación.",
                });
            }
            if (
                !val.reimburseTo?.bankInfo.ownerDoc.length ||
                val.reimburseTo.bankInfo.ownerDoc.length < 3
            ) {
                ctx.addIssue({
                    path: ["reimburseTo.bankInfo.ownerDoc"],
                    code: z.ZodIssueCode.custom,
                    message: "Favor ingrese el documento del titular.",
                });
            }

        }
        if (val.wasConvertedToOtherCurrency && val.exchangeRate <= 0) {
            ctx.addIssue({
                path: ["exchangeRate"],
                code: z.ZodIssueCode.custom,
                message: "Favor ingrese una tasa de cambio mayor a 0.",
            });
        }
    });

export const defaultExpenseReportData: FormExpenseReport = {
    id: "",
    concept: "",
    createdAt: new Date(),
    updatedAt: null,
    facturaNumber: "",
    amountSpent: new Prisma.Decimal(0),
    moneyRequestId: "",
    currency: "PYG",
    projectId: "",
    comments: "",
    accountId: "",
    taxPayer: { razonSocial: "", ruc: "" },
    searchableImage: { url: "", imageName: "" },
    wasCancelled: false,
    costCategoryId: null,
    wasConvertedToOtherCurrency: false,
    exchangeRate: 0,
    pendingAmount: new Prisma.Decimal(0),
    reimburseTo: {
        razonSocial: "",
        ruc: "",
        bankInfo: {
            bankName: "BANCOP",
            accountNumber: "",
            ownerName: "",
            ownerDocType: "CI",
            ownerDoc: "",
            taxPayerId: "",
            type: "SAVINGS",
        },
    },
    spentAmountIsGraterThanMoneyRequest: false,
};

export const MockExpenseReport = ({
    moneyReqId,
    projectId,
    costCategoryId,
}: {
    moneyReqId: string;
    projectId: string;
    costCategoryId: string;
}) => {
    const imageName = uuidV4();
    const x: FormExpenseReport = {
        concept: faker.commerce.productDescription().substring(0, 32),
        searchableImage: {
            url: "https://statingstoragebrasil.blob.core.windows.net/clbmbqh3o00008x98b3v23a7e/2c96c577-01a6-4a42-8681-907593b087aa",
            imageName,
        },
        taxPayer: {
            razonSocial: faker.name.fullName(),
            ruc: faker.random.numeric(6) + "-" + faker.random.numeric(1),
        },
        id: "",
        createdAt: new Date(),
        updatedAt: null,
        currency: "PYG",
        moneyRequestId: moneyReqId,
        amountSpent: new Prisma.Decimal(faker.commerce.price(100000, 300000)),
        pendingAmount: new Prisma.Decimal(0),
        facturaNumber: faker.random.numeric(13).toString(),
        comments: faker.commerce.productDescription().substring(0, 123),
        accountId: "",
        wasCancelled: false,
        wasConvertedToOtherCurrency: false,
        exchangeRate: 7000,
        projectId,
        costCategoryId,
        reimburseTo: {
            razonSocial: faker.company.name(),
            ruc: faker.random.numeric(6),
            bankInfo: {
                bankName: "BANCOP",
                accountNumber: faker.random.numeric(6),
                ownerName: faker.name.fullName(),
                ownerDocType: "CI",
                ownerDoc: faker.random.numeric(6),
                taxPayerId: "",
                type: "SAVINGS",
            },
        },
        spentAmountIsGraterThanMoneyRequest: false,
    };
    return x;
};
