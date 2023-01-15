import type { TaxPayer, Transaction } from '@prisma/client';
import { BankNamesPy } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';

import { randEnumValue } from '@/lib/utils/TypescriptUtils';
import type { FormProject } from '@/lib/validations/project.validate';
import type { FormExpenseReport } from '@/lib/validations/expenseReport.validate';
import type {
  FormBankInfo,
  FormMoneyAccount,
} from '@/lib/validations/moneyAcc.validate';
import type { FormMoneyRequest } from '@/lib/validations/moneyRequest.validate';
import type { FormImbursement } from '@/lib/validations/imbursement.validate';

const bankInfo: () => FormBankInfo = () => {
  const x: FormBankInfo = {
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

export const moneyAccMock: () => FormMoneyAccount = () => {
  const x: FormMoneyAccount = {
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

export const projectMock: () => FormProject = () => {
  const x: FormProject = {
    id: '',
    createdAt: new Date(),
    updatedAt: null,
    createdById: '',
    updatedById: null,
    endDate: null,
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
        assignedAmount: new Prisma.Decimal(
          faker.commerce.price(1000000, 3000000)
        ),
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
        assignedAmount: new Prisma.Decimal(
          faker.commerce.price(1000000, 3000000)
        ),
        projectId: null,
      },
    ],
    projectType: 'SUBSIDY',
  };
  return x;
};
export const moneyRequestMock: () => FormMoneyRequest = () => {
  const x: FormMoneyRequest = {
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
    costCategoryId: null,
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
    currentBalance: new Prisma.Decimal(0),
    transactionAmount: new Prisma.Decimal(
      faker.commerce.price(1000000, 3000000)
    ),
    isCancellation: false,
    moneyAccountId: '',
    moneyRequestId: null,
    imbursementId: null,
    expenseReturnId: null,
    cancellationId: null,
    projectId: null,
    costCategoryId: null,
  };
  return x;
};
export const imbursementMock: () => FormImbursement = () => {
  const x: FormImbursement = {
    id: '',
    createdAt: new Date(),
    updatedAt: null,
    updatedById: null,
    concept: faker.commerce.productDescription().substring(0, 123),
    wasConvertedToOtherCurrency: true,
    exchangeRate: 6500,
    otherCurrency: 'USD',
    amountInOtherCurrency: new Prisma.Decimal(
      faker.commerce.price(1000, 10000)
    ),
    finalCurrency: 'PYG',
    finalAmount: new Prisma.Decimal(0),
    archived: false,
    softDeleted: false,
    moneyAccountId: null,
    projectId: null,
    taxPayer: { razonSocial: '', ruc: '' },
    invoiceFromOrg: { url: '', imageName: '' },
    imbursementProof: { url: '', imageName: '' },
    accountId: '',
    wasCancelled: false,
  };
  return x;
};

type mockExpenseReport = Omit<FormExpenseReport, 'projectId'>;

export const expenseReportMock: ({
  moneyReqId,
}: {
  moneyReqId: string;
}) => mockExpenseReport = ({ moneyReqId }) => {
  const x: mockExpenseReport = {
    searchableImage: {
      url: 'https://statingstoragebrasil.blob.core.windows.net/clbmbqh3o00008x98b3v23a7e/2c96c577-01a6-4a42-8681-907593b087aa',
      imageName: '2c96c577-01a6-4a42-8681-907593b087aa',
    },
    taxPayer: {
      razonSocial: faker.name.fullName(),
      ruc: faker.random.numeric(6) + '-' + faker.random.numeric(1),
    },
    id: '',
    createdAt: new Date(),
    updatedAt: null,
    currency: 'PYG',
    moneyRequestId: moneyReqId,
    amountSpent: new Prisma.Decimal(faker.commerce.price(100000, 300000)),
    facturaNumber: faker.random.numeric(11),
    comments: faker.commerce.productDescription().substring(0, 123),
    accountId: '',
  };
  return x;
};
