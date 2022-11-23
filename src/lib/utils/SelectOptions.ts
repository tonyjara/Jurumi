import { BankNamesPy } from '@prisma/client';
import { parsedBanks } from './ParsedEnums';

export const bankNameOptions = Object.values(BankNamesPy).map((bank) => ({
  value: bank,
  label: parsedBanks(bank),
}));
