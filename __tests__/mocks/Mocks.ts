import type { TaxPayer, Transaction } from '@prisma/client';
import { BankNamesPy } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { v4 as uuidV4 } from 'uuid';
import { randEnumValue } from '@/lib/utils/TypescriptUtils';
import type { FormProject } from '@/lib/validations/project.validate';
import type { FormExpenseReport } from '@/lib/validations/expenseReport.validate';
import type {
  FormBankInfo,
  FormMoneyAccount,
} from '@/lib/validations/moneyAcc.validate';
import type { FormMoneyRequest } from '@/lib/validations/moneyRequest.validate';
import type { FormImbursement } from '@/lib/validations/imbursement.validate';
import type { FormTransactionCreate } from '@/lib/validations/transaction.create.validate';
import type { FormExpenseReturn } from '@/lib/validations/expenseReturn.validate';

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

export const moneyAccMock = ({
  organizationId,
}: {
  organizationId: string;
}) => {
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
    organizationId,
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
export const moneyRequestMock: (organizationId: string) => FormMoneyRequest = (
  organizationId
) => {
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
    wasCancelled: false,
    organizationId,
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
    expenseReportId: null,
    transactionType: 'MONEY_ACCOUNT',
  };
  return x;
};
export const imbursementMock: (
  moneyAccOptions:
    | {
        value: string;
        label: string;
      }[]
    | undefined,
  projectOptions:
    | {
        value: string;
        label: string;
      }[]
    | undefined
) => FormImbursement = (moneyAccOptions, projectOptions) => {
  const amountInOtherCurrency = new Prisma.Decimal(
    faker.commerce.price(500, 2000)
  );
  const exchangeRate = 6500;
  const imageName = uuidV4();

  const finalAmount = amountInOtherCurrency.times(exchangeRate);
  const x: FormImbursement = {
    id: '',
    createdAt: new Date(),
    updatedAt: null,
    updatedById: null,
    concept: faker.commerce.productDescription().substring(0, 123),
    wasConvertedToOtherCurrency: true,
    exchangeRate,
    otherCurrency: 'USD',
    amountInOtherCurrency,
    finalCurrency: 'PYG',
    finalAmount: finalAmount,
    archived: false,
    softDeleted: false,
    moneyAccountId:
      moneyAccOptions && moneyAccOptions[0]?.value
        ? moneyAccOptions[0]?.value
        : '',
    projectId:
      projectOptions && projectOptions[0]?.value
        ? projectOptions[0]?.value
        : '',
    taxPayer: { razonSocial: 'Antonio Jara', ruc: '3655944' },
    invoiceFromOrg: { url: '', imageName: '' },
    imbursementProof: {
      url: 'https://statingstoragebrasil.blob.core.windows.net/clbmbqh3o00008x98b3v23a7e/2c96c577-01a6-4a42-8681-907593b087aa',
      imageName,
    },
    accountId: '',
    wasCancelled: false,
  };
  return x;
};

export const expenseReportMock = ({
  moneyReqId,
  projectId,
  costCategoryId,
}: {
  moneyReqId: string;
  projectId: string;
  costCategoryId: string;
}) => {
  const imageName = uuidV4();
  const x: FormExpenseReport = {
    searchableImage: {
      url: 'https://statingstoragebrasil.blob.core.windows.net/clbmbqh3o00008x98b3v23a7e/2c96c577-01a6-4a42-8681-907593b087aa',
      imageName,
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
    facturaNumber: faker.random.numeric(13).toString(),
    comments: faker.commerce.productDescription().substring(0, 123),
    accountId: '',
    wasCancelled: false,
    projectId,
    costCategoryId,
  };
  return x;
};

export const TransactionCreateMock = () => {
  const tx: FormTransactionCreate = {
    id: 0,
    createdAt: new Date(),
    updatedAt: null,
    accountId: '',
    updatedById: null,
    transactions: [
      {
        currency: 'PYG',
        transactionAmount: new Prisma.Decimal(0),
        moneyAccountId: '',
        transactionProofUrl: '',
      },
    ],
    transactionType: 'MONEY_ACCOUNT',
    openingBalance: new Prisma.Decimal(0),
    currentBalance: new Prisma.Decimal(0),
    moneyRequestId: null,
    imbursementId: null,
    expenseReturnId: null,
    cancellationId: null,
    projectId: null,
    expenseReportId: null,
    isCancellation: false,
    searchableImage: { url: '', imageName: '' },
  };
  return tx;
};

export const expenseReturnMock = ({
  moneyAccountId,
  moneyRequestId,
  amountReturned,
}: {
  moneyAccountId: string;
  moneyRequestId: string;
  amountReturned: Prisma.Decimal;
}) => {
  const imageName = uuidV4();
  const x: FormExpenseReturn = {
    id: '',
    createdAt: new Date(),
    updatedAt: null,
    amountReturned,
    moneyRequestId,
    currency: 'PYG',
    moneyAccountId,
    accountId: '',
    searchableImage: {
      url: 'https://statingstoragebrasil.blob.core.windows.net/clbmbqh3o00008x98b3v23a7e/2c96c577-01a6-4a42-8681-907593b087aa',
      imageName,
    },
    wasCancelled: false,
  };
  return x;
};
