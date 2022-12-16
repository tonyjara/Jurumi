import type { TaxPayer, Transaction } from '@prisma/client';
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
import type { expenseReportValidateType } from '../../lib/validations/expenseReport.validate';

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
export const taxPayerMock: () => TaxPayer = () => {
  const x: TaxPayer = {
    id: '',
    createdAt: new Date(),
    updatedAt: null,
    createdById: '',
    updatedById: null,
    razonSocial: faker.name.fullName(),
    ruc: faker.random.numeric(6) + '-' + faker.random.numeric(1),
    fantasyName: faker.name.firstName(),
    archived: false,
    softDeleted: false,
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
        openingBalance: new Prisma.Decimal(
          faker.commerce.price(1000000, 3000000)
        ),
        executedAmount: new Prisma.Decimal(0),
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
        openingBalance: new Prisma.Decimal(
          faker.commerce.price(1000000, 3000000)
        ),
        executedAmount: new Prisma.Decimal(0),
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
    costCategoryId: '',
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
    imbursementId: null,
    expenseReturnId: null,
  };
  return x;
};

type mockExpenseReport = Omit<expenseReportValidateType, 'projectId'>;

export const expenseReportMock: ({
  moneyReqId,
}: {
  moneyReqId: string;
}) => mockExpenseReport = ({ moneyReqId }) => {
  const x: mockExpenseReport = {
    facturaPictureUrl:
      'https://statingstoragebrasil.blob.core.windows.net/clbmbqh3o00008x98b3v23a7e/2c96c577-01a6-4a42-8681-907593b087aa',
    imageName: '2c96c577-01a6-4a42-8681-907593b087aa',
    taxPayerRuc: faker.random.numeric(6) + '-' + faker.random.numeric(1),
    taxPayerRazonSocial: faker.name.fullName(),

    id: '',
    createdAt: new Date(),
    updatedAt: null,
    currency: 'PYG',
    // projectId: null,
    moneyRequestId: moneyReqId,
    costCategoryId: null,
    amountSpent: new Prisma.Decimal(faker.commerce.price(100000, 300000)),
    facturaNumber: faker.random.numeric(11),
    comments: faker.commerce.productDescription().substring(0, 123),
    accountId: '',
  };
  return x;
};
