import type { BankNamesPy, Currency } from '@prisma/client';

export const parsedPrefix = (currency: Currency) => {
  const prefixes: { [key in Currency]?: string } = {
    PYG: 'Gs. ',
    USD: '$. ',
  };

  return prefixes[currency] ?? 'Gs. ';
};
export const parsedBanks = (bankName: BankNamesPy) => {
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
