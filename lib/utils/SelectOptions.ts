import type {
  MoneyRequestStatus,
  MoneyRequestType,
  TransactionType,
} from "@prisma/client";
import { MemberType } from "@prisma/client";
import { BankAccountType } from "@prisma/client";
import { ProjectType } from "@prisma/client";
import { BankDocType, BankNamesPy, Currency } from "@prisma/client";
import {
  translateBankNames,
  translateBankDocTypes,
  translateCurrency,
  translateProjectType,
  translatedBankAccountType,
  translateMemberTypes,
} from "./TranslatedEnums";

export const projectTypeOptions = Object.values(ProjectType).map((type) => ({
  value: type,
  label: translateProjectType(type),
}));
export const memberTypeOptions = Object.values(MemberType).map((type) => ({
  value: type,
  label: translateMemberTypes(type),
}));
export const bankNameOptions = Object.values(BankNamesPy).map((bank) => ({
  value: bank,
  label: translateBankNames(bank),
}));
export const bankAccTypeOptions = Object.values(BankAccountType).map((acc) => ({
  value: acc,
  label: translatedBankAccountType(acc),
}));
export const ownerDocTypeOptions = Object.values(BankDocType).map(
  (docType) => ({
    value: docType,
    label: translateBankDocTypes(docType),
  }),
);

export const currencyOptions = Object.values(Currency).map((currency) => ({
  value: currency,
  label: translateCurrency(currency),
}));

export const moneyRequestStatusOptions: {
  value: MoneyRequestStatus;
  label: string;
}[] = [
  { value: "ACCEPTED", label: "Aceptado" },
  { value: "PENDING", label: "Pendiente" },
  { value: "REJECTED", label: "Rechazado" },
];

export const moneyRequestTypeOptions: {
  value: MoneyRequestType;
  label: string;
}[] = [
  { value: "FUND_REQUEST", label: "Solicitud de anticipo" },
  { value: "MONEY_ORDER", label: "Orden de pago" },
  { value: "REIMBURSMENT_ORDER", label: "Solicitud de re-embolso" },
];

export const transactionTypeOptions: {
  value: TransactionType;
  label: string;
}[] = [
  { value: "OFFSET", label: "Ajuste" },
  { value: "COST_CATEGORY", label: "Linea Presupuestaria" },
  { value: "MONEY_ACCOUNT", label: "Cuenta de dinero" },
  { value: "EXPENSE_RETURN", label: "Devolución" },
  /* { value: 'MEMBERSHIP_PAYMENT', label: 'Cuota de socio' }, */
  { value: "PROJECT_IMBURSEMENT", label: "Desembolso en proyecto" },
  { value: "MONEY_ACCOUNT_IMBURSEMENT", label: "Desembolso en cuenta" },
];
