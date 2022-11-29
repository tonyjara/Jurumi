import type { BankAccount } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const bankAccMock: () => BankAccount = () => {
  return {
    id: '',
    createdAt: new Date(),
    updatedAt: null,
    createdById: '',
    updatedById: null,
    bankName: 'ITAU',
    accountNumber: faker.finance.account(),
    ownerName: faker.name.fullName(),
    ownerDocType: 'CI',
    ownerDoc: faker.finance.account(6),
    ownerContactNumber: '0981123123',
    currency: 'PYG',
    type: 'SAVINGS',
    country: 'Paraguay',
    city: 'Asuncion',
    balance: new Prisma.Decimal(faker.commerce.price(1000000, 3000000)),
    archived: false,
    softDeleted: false,
  };
};
