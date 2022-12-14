import type { MoneyRequestStatus, MoneyRequestType } from '@prisma/client';
import { BankDocType, BankNamesPy, Currency } from '@prisma/client';
import {
  translateBankNames,
  translateBankDocTypes,
  translateCurrency,
} from './TranslatedEnums';

export const bankNameOptions = Object.values(BankNamesPy).map((bank) => ({
  value: bank,
  label: translateBankNames(bank),
}));
export const ownerDocTypeOptions = Object.values(BankDocType).map(
  (docType) => ({
    value: docType,
    label: translateBankDocTypes(docType),
  })
);

export const currencyOptions = Object.values(Currency).map((currency) => ({
  value: currency,
  label: translateCurrency(currency),
}));

export const moneyRequestStatusOptions: {
  value: MoneyRequestStatus;
  label: string;
}[] = [
  { value: 'ACCEPTED', label: 'Aceptado' },
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'REJECTED', label: 'Rechazado' },
];

export const moneyRequestTypeOptions: {
  value: MoneyRequestType;
  label: string;
}[] = [
  { value: 'FUND_REQUEST', label: 'Solicitud de Adelanto' },
  { value: 'MONEY_ORDER', label: 'Orden de pago' },
  { value: 'REIMBURSMENT_ORDER', label: 'Solicitud de re-embolso' },
];
