import type { Transaction } from '@prisma/client';
import { BankNamesPy } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';
import type {
  BankInfoModelType,
  MoneyAccWithBankInfo,
} from '../../lib/validations/moneyAcc.validate';
import { randEnumValue } from '../../lib/utils/TypescriptUtils';
import type { ProjectWithCostCat } from '../../lib/validations/project.validate';
import type { moneyRequestValidateData } from '../../lib/validations/moneyRequest.validate';

const bankInfo: () => BankInfoModelType = () => {
  const x: BankInfoModelType = {
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
  return x;
};

export const moneyAccMock: () => MoneyAccWithBankInfo = () => {
  const x: MoneyAccWithBankInfo = {
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
  return x;
};

export const projectMock: () => ProjectWithCostCat = () => {
  const x: ProjectWithCostCat = {
    id: '',
    createdAt: new Date(),
    updatedAt: null,
    createdById: '',
    updatedById: null,
    displayName:
      faker.commerce.productAdjective() + ' ' + faker.company.bsBuzz(),
    organizationId: '',
    archived: false,
    softDeleted: false,
    description: faker.commerce.productDescription().substring(0, 127),
    costCategories: [
      {
        id: '',
        createdAt: new Date(),
        updatedAt: null,
        createdById: '',
        updatedById: null,
        displayName: faker.commerce.product(),
        currency: 'PYG',
        balance: new Prisma.Decimal(faker.commerce.price(1000000, 3000000)),
        projectId: null,
      },
      {
        id: '',
        createdAt: new Date(),
        updatedAt: null,
        createdById: '',
        updatedById: null,
        displayName: faker.commerce.product(),
        currency: 'PYG',
        balance: new Prisma.Decimal(faker.commerce.price(1000000, 3000000)),
        projectId: null,
      },
    ],
  };
  return x;
};
export const moneyRequestMock: () => moneyRequestValidateData = () => {
  const x: moneyRequestValidateData = {
    id: '',
    createdAt: new Date(),
    updatedAt: null,
    description: faker.commerce.productDescription().substring(0, 123),
    status: 'PENDING',
    moneyRequestType: 'FUND_REQUEST',
    currency: 'PYG',
    amountRequested: new Prisma.Decimal(faker.commerce.price(1000000, 3000000)),
    accountId: '',
    projectId: null,
    archived: false,
    softDeleted: false,
    rejectionMessage: '',
    organizationId: '',
    facturaNumber: '',
    facturaPictureUrl: '',
    costCategories: [],
    taxPayerId: '',
  };
  return x;
};
export const transactionMock: () => Transaction = () => {
  const x: Transaction = {
    id: 0,
    createdAt: new Date(),
    updatedAt: null,
    accountId: '',
    updatedById: null,
    currency: 'PYG',
    openingBalance: new Prisma.Decimal(faker.commerce.price(1000000, 3000000)),
    transactionAmount: new Prisma.Decimal(
      faker.commerce.price(1000000, 3000000)
    ),
    moneyAccountId: '',
    moneyRequestId: null,
    transactionProofUrl: '',
    imbursementId: null,
    expenseReturnId: null,
  };
  return x;
};
