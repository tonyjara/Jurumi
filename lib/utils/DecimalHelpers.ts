import type { Currency } from '@prisma/client';
import { Prisma } from '@prisma/client';
import DecimalFormat from 'decimal-format';
import { translateCurrencyPrefix } from './TranslatedEnums';
//For the moment being, only handles PYG
export const addDecimals = <
  T extends { currency: Currency },
  K extends keyof T
>(
  x: T[],
  y: K
) => {
  const decimalTotal = x.reduce((acc, val) => {
    const decimalVal = val[y] as Prisma.Decimal;
    return acc.add(decimalVal);
  }, new Prisma.Decimal(0));

  const df = new DecimalFormat(`${translateCurrencyPrefix('PYG')} #,##0.#`);
  return df.format(decimalTotal.toString());
};

export const decimalFormat = (x: Prisma.Decimal, y: Currency) => {
  if (y === 'USD') {
    const df = new DecimalFormat(`${translateCurrencyPrefix(y)} #,##0.00#`);
    return df.format(x.toString());
  }
  const df = new DecimalFormat(`${translateCurrencyPrefix(y)} #,##0.#`);
  return df.format(x.toString());
};

export const addDecimalsToNumber = <
  T extends { currency: Currency },
  K extends keyof T
>(
  x: T[],
  y: K
) => {
  const decimalTotal = x.reduce((acc, val) => {
    const decimalVal = val[y] as Prisma.Decimal;
    return acc.add(decimalVal);
  }, new Prisma.Decimal(0));

  return decimalTotal.toNumber();
};

export function kFormatter(num: number) {
  const formatter = Intl.NumberFormat('en', { notation: 'compact' });
  return formatter.format(num);
}
export function thousandsFormatter(num: number) {
  const formatter = Intl.NumberFormat('en');
  return formatter.format(num);
}
