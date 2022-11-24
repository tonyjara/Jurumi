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
