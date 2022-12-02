import type { MoneyRequest, Project, MoneyAccount } from '@prisma/client';
import { BankNamesPy } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';
import type { BankInfoModel } from '../../lib/validations/moneyAcc.validate';
import { randEnumValue } from '../../lib/utils/TypescriptUtils';

const bankInfo: () => BankInfoModel = () => {
  return {
    bankName: randEnumValue(BankNamesPy),
    type: 'SAVINGS',
    accountNumber: faker.finance.account(),
    ownerName: faker.name.fullName(),
    ownerDocType: 'CI',
    ownerDoc: faker.finance.account(5),
    country: 'Asuncion',
    city: 'Paraguay',
    ownerContactNumber: '0981 999 111',
  };
};

export const moneyAccMock: () => MoneyAccount = () => {
  return {
    id: '',
    createdAt: new Date(),
    updatedAt: null,
    createdById: '',
    updatedById: null,
    isCashAccount: false,
    currency: 'PYG',
    initialBalance: new Prisma.Decimal(faker.commerce.price(1000000, 3000000)),
    displayName: faker.commerce.department(),
    archived: false,
    softDeleted: false,
    bankInfo: bankInfo(),
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
    organizationId: '',
    allowedUsers: [],
    archived: false,
    softDeleted: false,
    description: '',
    taxPayerId: null,
  };
};
export const moneyRequestMock: () => MoneyRequest = () => {
  return {
    id: '',
    createdAt: new Date(),
    updatedAt: null,
    description: '',
    status: 'PENDING',
    moneyRequestType: 'FUND_REQUEST',
    currency: 'USD',
    amountRequested: new Prisma.Decimal(faker.commerce.price(1000000, 3000000)),
    fundSentPictureUrl: '',
    accountId: '',
    moneyAccountId: null,
    projectId: null,
    archived: false,
    softDeleted: false,
  };
};
