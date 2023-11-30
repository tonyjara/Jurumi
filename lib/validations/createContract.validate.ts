import {
  Currency,
  type Contracts,
  ContractFrequency,
  MoneyRequestType,
  Prisma,
  DaysOfTheWeek,
  ContractPayments,
} from "@prisma/client";
import { addMonths } from "date-fns";
import Decimal from "decimal.js";
import * as z from "zod";

export type FormContractPayments = Omit<
  ContractPayments,
  "createdAt" | "updatedAt" | "contractsId" | "moneyRequestId" | "amount"
> & { amount?: any };

export type FormContract = Omit<
  Contracts,
  | "amount"
  | "createdAt"
  | "updatedAt"
  | "wasCancelledAt"
  | "wasCancelled"
  | "softDeleted"
  | "archived"
  | "wasFinalized"
> & {
  amount?: any;
  payments: FormContractPayments[];
};

export const validateContract: z.ZodType<FormContract> = z.lazy(() =>
  z.object({
    id: z.number(),
    accountId: z.string().nullable(),
    amount: z.any().transform((value) => new Decimal(value)),
    contratCategoriesId: z.number({
      invalid_type_error: "Debe seleccionar una categoría",
    }),
    costCategoryId: z.string().nullable(),
    contractUrl: z.string().nullable(),
    currency: z.nativeEnum(Currency),
    description: z
      .string()
      .min(20, "Debe tener al menos (20) caractéres")
      .max(255, "No puede tener más de (255) caractéres"),
    endDate: z.date().nullable(),
    paymentDate: z.date().nullable(),
    monthlyPaymentDay: z.number().nullable(),
    weeklyPaymentDay: z.nativeEnum(DaysOfTheWeek).nullable(),
    yearlyPaymentDate: z.date().nullable(),
    frequency: z.nativeEnum(ContractFrequency),
    moneyRequestType: z.nativeEnum(MoneyRequestType),
    name: z
      .string()
      .min(2, "Debe tener al menos (2) caractéres")
      .max(100, "No puede tener más de (100) caractéres"),
    projectId: z.string().nullable(),
    remindDaysBefore: z.number(),
    payments: z
      .object({
        id: z.number(),
        name: z.string().min(1),
        amount: z.any().transform((value) => new Decimal(value)),
        currency: z.nativeEnum(Currency),
        dateDue: z.date(),
      })
      .array(),
  }),
);

export const defaultContractPaymentsValues: ({}: {
  length: number;
  amount: Decimal;
  addedMonths: number;
  firstPaymentDate?: Date;
}) => FormContractPayments = ({
  length,
  amount,
  addedMonths,
  firstPaymentDate,
}) => {
  return {
    id: 0,
    name: `Cuota ${length + 1}`,
    amount: amount,
    currency: "PYG",
    dateDue: addMonths(firstPaymentDate ?? new Date(), addedMonths),
  };
};
export const defaultCreateContractsValues: FormContract = {
  id: 0,
  amount: new Prisma.Decimal(0),
  accountId: null,
  contractUrl: null,
  contratCategoriesId: null,
  costCategoryId: null,
  currency: "PYG",
  description: "",
  endDate: null,
  frequency: "MONTHLY",
  moneyRequestType: "FUND_REQUEST",
  paymentDate: null,
  monthlyPaymentDay: null,
  weeklyPaymentDay: null,
  yearlyPaymentDate: null,
  remindDaysBefore: 0,
  name: "",
  projectId: null,
  payments: [
    defaultContractPaymentsValues({
      length: 0,
      amount: new Prisma.Decimal(0),
      addedMonths: 0,
    }),
  ],
};
