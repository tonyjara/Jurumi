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
import type { MoneyRequestComplete } from '@/pageContainers/mod/requests/MoneyRequestsPage.mod.requests';

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
    financerName: faker.name.fullName(),
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
    concept: faker.commerce.productDescription().substring(0, 32),
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

export const moneyReqCompleteMock = (userId: string | undefined) => {
  const x: MoneyRequestComplete = {
    id: 'cldagi67k005qpftt2ssd67m9',
    createdAt: new Date(),
    updatedAt: null,
    description:
      'The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J',
    status: 'ACCEPTED',
    moneyRequestType: 'FUND_REQUEST',
    currency: 'PYG',
    amountRequested: new Prisma.Decimal(1681068),
    rejectionMessage: '',
    archived: false,
    softDeleted: false,
    wasCancelled: false,
    accountId: userId ?? '',
    organizationId: 'clcqw4lz10008pf5s711y5uwx',
    projectId: 'cld1pg5wb0004pfe9w9bnpdn9',
    account: {
      id: 'clcqw3zaq0006pf5svlfa1iwg',
      active: true,
      createdAt: new Date(),
      updatedAt: null,
      email: 'tony@tony.com',
      displayName: 'Tony local',
      password: '$2a$10$kapySv/YYSdmo4xVMaKKqOu.yXj2LYdCpxPTaP58JevfN.lYRPfNm',
      role: 'ADMIN',
      isVerified: true,
    },
    project: {
      id: 'cld1pg5wb0004pfe9w9bnpdn9',
      createdAt: new Date(),
      updatedAt: null,
      createdById: 'clcqw3zaq0006pf5svlfa1iwg',
      endDate: null,
      updatedById: 'clcqw3zaq0006pf5svlfa1iwg',
      displayName: 'Pavap',
      description: 'Programa de apoyo a voluntarios',
      financerName: 'Arturo',
      archived: false,
      softDeleted: false,
      projectType: 'SUBSIDY',
      organizationId: 'clcqw4lz10008pf5s711y5uwx',
    },
    transactions: [
      {
        id: 116,
        createdAt: new Date(),
        updatedAt: null,
        updatedById: null,
        currency: 'PYG',
        openingBalance: new Prisma.Decimal(10000000),
        currentBalance: new Prisma.Decimal(8318932),
        transactionAmount: new Prisma.Decimal(1681068),
        isCancellation: false,
        transactionType: 'MONEY_ACCOUNT',
        cancellationId: null,
        accountId: userId ?? '',
        expenseReturnId: null,
        imbursementId: null,
        moneyAccountId: 'cld1p0vwq0002pfe9r8ozfzs1',
        moneyRequestId: 'cldagi67k005qpftt2ssd67m9',
        projectId: null,
        costCategoryId: null,
        expenseReportId: null,
      },
      {
        id: 118,
        createdAt: new Date(),
        updatedAt: null,
        updatedById: null,
        currency: 'PYG',
        openingBalance: new Prisma.Decimal(8318932),
        currentBalance: new Prisma.Decimal(9159466),
        transactionAmount: new Prisma.Decimal(840534),
        isCancellation: false,
        transactionType: 'EXPENSE_RETURN',
        cancellationId: null,
        accountId: userId ?? '',
        expenseReturnId: 'cldagi6870061pftttzyth6sn',
        imbursementId: null,
        moneyAccountId: 'cld1p0vwq0002pfe9r8ozfzs1',
        moneyRequestId: 'cldagi67k005qpftt2ssd67m9',
        projectId: null,
        costCategoryId: null,
        expenseReportId: null,
      },
    ],
    moneyRequestApprovals: [],
    expenseReports: [
      {
        id: 'cldagi67y005xpfttj4my35rs',
        createdAt: new Date(),
        updatedAt: null,
        facturaNumber: '9720455630179',
        amountSpent: new Prisma.Decimal(840534),
        currency: 'PYG',
        comments:
          'Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals',
        wasCancelled: false,
        accountId: userId ?? '',
        moneyRequestId: 'cldagi67k005qpftt2ssd67m9',
        projectId: 'cld1pg5wb0004pfe9w9bnpdn9',
        taxPayerId: 'cldagi67u005spftt9pqkq3y6',
        costCategoryId: 'cld1pg5wc0005pfe9qkxt5amm',
        concept: 'asdfgdfgsdfgs',
        taxPayer: { id: '234234234', razonSocial: 'Verduras del Paraguay SA' },
      },
    ],
    expenseReturns: [
      {
        id: 'cldagi6870061pftttzyth6sn',
        createdAt: new Date(),
        updatedAt: null,
        wasCancelled: false,
        currency: 'PYG',
        amountReturned: new Prisma.Decimal(840534),
        moneyAccountId: 'cld1p0vwq0002pfe9r8ozfzs1',
        moneyRequestId: 'cldagi67k005qpftt2ssd67m9',
        accountId: userId ?? '',
      },
    ],
    organization: {
      moneyRequestApprovers: [],
      moneyAdministrators: [],
    },
  };
  return x;
};
