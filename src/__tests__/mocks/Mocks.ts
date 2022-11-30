import type {
  BankAccount,
  Disbursement,
  PettyCash,
  Project,
} from '@prisma/client';
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
export const pettyCashMock: () => PettyCash = () => {
  return {
    id: '',
    createdAt: new Date(),
    updatedAt: null,
    createdById: '',
    updatedById: null,
    displayName: faker.commerce.department(),
    amount: new Prisma.Decimal(faker.commerce.price(1000000, 3000000)),
    currency: 'PYG',
    archived: false,
    softDeleted: false,
  };
};
export const projectMock: () => Project = () => {
  return {
    id: '',
    createdAt: new Date(),
    updatedAt: null,
    createdById: '',
    updatedById: null,
    displayName:
      faker.commerce.productAdjective() + ' ' + faker.company.bsBuzz(),
    assignedMoney: new Prisma.Decimal(faker.commerce.price(1000000, 3000000)),
    assignedMoneyCurrency: 'PYG',
    organizationId: '',
    allowedUsers: [],
    archived: false,
    softDeleted: false,
  };
};
export const disbursementMock: () => Disbursement = () => {
  return {
    accountId: '',
    amount: new Prisma.Decimal(faker.commerce.price(1000000, 3000000)),
    archived: false,
    bankId: null,
    createdAt: new Date(),
    createdById: '',
    currency: 'PYG',
    description: faker.hacker.phrase(),
    disbursementType: 'MONEY_ORDER',
    facturaNumber: '',
    id: '',
    pettyCashId: null,
    pictureUrl: '',
    projectId: null,
    scannedText: '',
    softDeleted: false,
    status: 'PENDING',
    taxPayerId: null,
    updatedAt: null,
    updatedById: null,
  };
};
