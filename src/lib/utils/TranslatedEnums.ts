import type { BankDocType, BankNamesPy, Currency } from '@prisma/client';
import type { Decimal } from '@prisma/client/runtime';
import DecimalFormat from 'decimal-format';

export const translateCurrencyPrefix = (currency: Currency) => {
  const prefixes: { [key in Currency]?: string } = {
    PYG: 'Gs ',
    USD: 'Usd ',
  };

  return prefixes[currency] ?? 'Gs ';
};
export const translateCurrency = (currency: Currency) => {
  const prefixes: { [key in Currency]?: string } = {
    PYG: 'Guaranies ',
    USD: 'Dólares ',
  };

  return prefixes[currency] ?? 'Guaranies ';
};
export const translateCurrencyShort = (currency: Currency) => {
  const prefixes: { [key in Currency]?: string } = {
    PYG: 'Gs. ',
    USD: 'Dólares ',
  };

  return prefixes[currency] ?? 'Guaranies ';
};

export const decimalFormat = (x: Decimal, y: Currency) => {
  if (y === 'USD') {
    const df = new DecimalFormat(`${translateCurrencyPrefix(y)} #,##0.00#`);
    return df.format(x.toString());
  }
  const df = new DecimalFormat(`${translateCurrencyPrefix(y)} #,##0.#`);
  return df.format(x.toString());
};

export const translateBankDocTypes = (docType: BankDocType) => {
  const docTypes: { [key in BankDocType]?: string } = {
    CI: 'Cédula de identidad. ',
    CRC: 'Crc',
    PASSPORT: 'Pasaporte',
    RUC: 'Ruc',
  };

  return docTypes[docType] ?? 'Cédula de identidad. ';
};
export const translateBankNames = (bankName: BankNamesPy) => {
  const bankNames: { [key in BankNamesPy]?: string } = {
    BANCOP: 'Bancop',
    BANCO_ATLAS: 'Banco Atlas',
    BANCO_BASA: 'Banco Basa',
    BANCO_CONTINENTAL: 'Banco Continental',
    BANCO_DE_LA_NACION_ARGENTINA: 'Banco de la Nación Argentina',
    BANCO_DO_BRASIL: 'Banco Do Brasil',
    BANCO_FAMILIAR: 'Banco Familiar',
    BANCO_GNB: 'Banco Gnb',
    BANCO_NACIONAL_DE_FOMENTO: 'Banco Nacional de Fomento',
    BANCO_REGIONAL: 'Banco Regional',
    BANCO_RIO: 'Banco Rio',
    CITIBANK: 'Citibank',
    INTERFISA_BANCO: 'Interfisa Banco',
    ITAU: 'Itau',
    SUDAMERIS: 'Sudameris',
    VISION_BANCO: 'Visión Banco',
  };

  return bankNames[bankName] ?? 'Itau';
};
