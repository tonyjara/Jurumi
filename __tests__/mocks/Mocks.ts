import { BankNamesPy, Currency } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { v4 as uuidV4 } from "uuid";
import { randEnumValue } from "@/lib/utils/TypescriptUtils";
import type { FormProject } from "@/lib/validations/project.validate";
import type {
  FormBankInfo,
  FormMoneyAccount,
} from "@/lib/validations/moneyAcc.validate";
import type { FormImbursement } from "@/lib/validations/imbursement.validate";
import type { FormTransactionCreate } from "@/lib/validations/transaction.create.validate";
import type { FormExpenseReturn } from "@/lib/validations/expenseReturn.validate";
import { FormMoneyAccounOffset } from "@/lib/validations/moneyAccountOffset.validate";
import { MoneyRequestComplete } from "@/pageContainers/mod/requests/mod.requests.types";
//@ts-ignore
const faker = (await import("@faker-js/faker")).faker;

const bankInfo: () => FormBankInfo = () => {
  const x: FormBankInfo = {
    bankName: randEnumValue(BankNamesPy),
    type: "SAVINGS",
    accountNumber: faker.finance.account(),
    ownerName: faker.name.fullName(),
    ownerDocType: "CI",
    ownerDoc: faker.finance.account(5),
    country: "Asuncion",
    city: "Paraguay",
    ownerContactNumber: "0981 999 111",
  };
  return x;
};

export const moneyAccMock = ({
  organizationId,
}: {
  organizationId: string;
}) => {
  const x: FormMoneyAccount = {
    id: "",
    createdAt: new Date(),
    updatedAt: null,
    createdById: "",
    updatedById: null,
    isCashAccount: false,
    currency: "PYG",
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
    id: "",
    createdAt: new Date(),
    updatedAt: null,
    createdById: "",
    updatedById: null,
    endDate: null,
    financerName: faker.name.fullName(),
    displayName:
      faker.commerce.productAdjective() + " " + faker.company.bsBuzz(),
    organizationId: "",
    archived: false,
    softDeleted: false,
    description: faker.commerce.productDescription().substring(0, 127),
    costCategories: [
      {
        id: "",
        createdAt: new Date(),
        updatedAt: null,
        createdById: "",
        updatedById: null,
        displayName: faker.commerce.product(),
        currency: "PYG",
        assignedAmount: new Prisma.Decimal(
          faker.commerce.price(1000000, 3000000),
        ),
        referenceExchangeRate: 7000,
        projectId: null,
      },
      {
        id: "",
        createdAt: new Date(),
        updatedAt: null,
        createdById: "",
        updatedById: null,
        displayName: faker.commerce.product(),
        referenceExchangeRate: 7000,
        currency: "PYG",
        assignedAmount: new Prisma.Decimal(
          faker.commerce.price(1000000, 3000000),
        ),
        projectId: null,
      },
    ],
    projectType: "SUBSIDY",
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
    | undefined,
) => FormImbursement = (moneyAccOptions, projectOptions) => {
  const amountInOtherCurrency = new Prisma.Decimal(
    faker.commerce.price(500, 2000),
  );
  const exchangeRate = 6500;
  const imageName = uuidV4();

  const finalAmount = amountInOtherCurrency.times(exchangeRate);
  const x: FormImbursement = {
    id: "",
    createdAt: new Date(),
    updatedAt: null,
    updatedById: null,
    concept: faker.commerce.productDescription().substring(0, 123),
    wasConvertedToOtherCurrency: true,
    exchangeRate,
    otherCurrency: "USD",
    amountInOtherCurrency,
    finalCurrency: "PYG",
    finalAmount: finalAmount,
    archived: false,
    softDeleted: false,
    moneyAccountId:
      moneyAccOptions && moneyAccOptions[0]?.value
        ? moneyAccOptions[0]?.value
        : "",
    projectId:
      projectOptions && projectOptions[0]?.value
        ? projectOptions[0]?.value
        : "",
    taxPayer: { razonSocial: "Antonio Jara", ruc: "3655944" },
    invoiceFromOrg: { url: "", imageName: "" },
    imbursementProof: {
      url: "https://statingstoragebrasil.blob.core.windows.net/clbmbqh3o00008x98b3v23a7e/2c96c577-01a6-4a42-8681-907593b087aa",
      imageName,
    },
    accountId: "",
    wasCancelled: false,
  };
  return x;
};

export const TransactionCreateMock = () => {
  const tx: FormTransactionCreate = {
    id: 0,
    createdAt: new Date(),
    updatedAt: null,
    accountId: "",
    updatedById: null,
    transactions: [
      {
        currency: "PYG",
        transactionAmount: new Prisma.Decimal(0),
        moneyAccountId: "",
        exchangeRate: 7000,
        wasConvertedToOtherCurrency: false,
      },
    ],
    transactionType: "MONEY_ACCOUNT",
    openingBalance: new Prisma.Decimal(0),
    currentBalance: new Prisma.Decimal(0),
    moneyRequestId: null,
    imbursementId: null,
    expenseReturnId: null,
    membershipId: null,
    membershipPaymentRequestId: null,
    cancellationId: null,
    costCategoryId: null,
    projectId: null,
    expenseReportId: null,
    isCancellation: false,
    searchableImage: { url: "", imageName: "" },
    moneyAccountOffsetId: null,
  };
  return tx;
};

export const moneyAccountOffsetMock = ({
  moneyAccountId,
  currency,
  previousBalance,
}: Partial<FormMoneyAccounOffset>) => {
  const mock: FormMoneyAccounOffset = {
    id: "",
    createdAt: new Date(),
    updatedAt: null,
    offsettedAmount: new Prisma.Decimal(faker.commerce.price(100000, 300000)),
    offsetJustification: faker.commerce.productDescription().substring(0, 12),
    moneyAccountId: moneyAccountId ?? "",
    currency: currency ?? "PYG",
    accountId: "",
    wasCancelled: false,
    previousBalance: previousBalance ?? new Prisma.Decimal(0),
    isSubstraction: true,
  };

  return mock;
};

export const expenseReturnMock = ({
  moneyAccountId,
  moneyRequestId,
  amountReturned,
  currency,
}: {
  moneyAccountId: string;
  moneyRequestId: string;
  amountReturned: Prisma.Decimal;
  currency: Currency;
}) => {
  const imageName = uuidV4();
  const x: FormExpenseReturn = {
    id: "",
    createdAt: new Date(),
    updatedAt: null,
    amountReturned,
    moneyRequestId,
    currency,
    moneyAccountId,
    accountId: "",
    wasConvertedToOtherCurrency: false,
    exchangeRate: 7000,
    searchableImage: {
      url: "https://statingstoragebrasil.blob.core.windows.net/clbmbqh3o00008x98b3v23a7e/2c96c577-01a6-4a42-8681-907593b087aa",
      imageName,
    },
    wasCancelled: false,
  };
  return x;
};

export const moneyReqCompleteMock = (userId: string | undefined) => {
  const imageName1 = uuidV4();
  const imageName2 = uuidV4();
  const x: MoneyRequestComplete = {
    id: "cldagi67k005qpftt2ssd67m9",
    moneyOrderNumber: null,
    comments: faker.commerce.productDescription().substring(0, 100),
    taxPayer: {
      id: "",
      razonSocial: faker.name.fullName(),
      ruc: faker.random.numeric(6),
      bankInfo: {
        bankName: "ITAU",
        accountNumber: faker.finance.account(),
        ownerName: faker.name.fullName(),
        ownerDocType: "CI",
        ownerDoc: faker.finance.account(5),
        taxPayerId: "",
        type: "CURRENT",
      },
    },
    searchableImages: [
      {
        id: "clgb8t2iz001o9k0e8pl6i7kj",
        createdAt: new Date(),
        updatedAt: new Date(),
        url: "https://statingstoragebrasil.blob.core.windows.net/clddek00c0000pfuegl07osko/7267e150-8277-4296-98a7-63fdfda9e60d?sv=2021-10-04&ss=b&srt=sco&spr=https%2Chttp&st=2023-04-10T19%3A44%3A35Z&se=2023-04-29T01%3A44%3A35Z&sp=rw&sig=pGaO37fpO7PfwLXZcGNKIDpBCj%2B7%2BLJTs%2BsClz%2FIRvE%3D",
        text: "",
        imageName: "7267e150-8277-4296-98a7-63fdfda9e60d",
        facturaNumber: "3906832915780",
        currency: "PYG",
        amount: new Prisma.Decimal(2831538),
        accountId: null,
        expenseReportId: null,
        moneyRequestId: "clgb8t2j2001s9k0e5rh9ahit",
        expenseReturnId: null,
        transactionId: null,
        imbursementId: null,
      },
      {
        id: "clgb8t2j1001q9k0e20b88ho6",
        createdAt: new Date(),
        updatedAt: new Date(),
        url: "https://statingstoragebrasil.blob.core.windows.net/clddek00c0000pfuegl07osko/fd613edb-fb69-4e5d-983e-30eeae83a324?sv=2021-10-04&ss=b&srt=sco&spr=https%2Chttp&st=2023-04-10T19%3A44%3A40Z&se=2023-04-29T01%3A44%3A40Z&sp=rw&sig=vfMZ6fbgQqV5IDqdWfcDzwrnZpazzO6lSkxu4dneOZ8%3D",
        text: "",
        imageName: "fd613edb-fb69-4e5d-983e-30eeae83a324",
        facturaNumber: "3045909511258",
        currency: "PYG",
        amount: new Prisma.Decimal(1123856),
        accountId: null,
        expenseReportId: null,
        moneyRequestId: "clgb8t2j2001s9k0e5rh9ahit",
        expenseReturnId: null,
        transactionId: null,
        imbursementId: null,
      },
    ],
    facturaNumber: null,
    costCategory: null,
    createdAt: new Date(),
    operationDate: new Date(),
    updatedAt: null,
    taxPayerId: null,
    costCategoryId: "",
    description:
      "The Nagasaki Lander is the trademarked name of several series of Nagasaki sport bikes, that started with the 1984 ABC800J",
    status: "ACCEPTED",
    moneyRequestType: "FUND_REQUEST",
    currency: "PYG",
    amountRequested: new Prisma.Decimal(1681068),
    rejectionMessage: "",
    archived: false,
    softDeleted: false,
    wasCancelled: false,
    accountId: userId ?? "",
    organizationId: "clcqw4lz10008pf5s711y5uwx",
    projectId: "cld1pg5wb0004pfe9w9bnpdn9",
    account: {
      id: "clcqw3zaq0006pf5svlfa1iwg",
      /* active: true, */
      /* createdAt: new Date(), */
      /* updatedAt: null, */
      /* email: "tony@tony.com", */
      displayName: "Tony local",
      /* password: "$2a$10$kapySv/YYSdmo4xVMaKKqOu.yXj2LYdCpxPTaP58JevfN.lYRPfNm", */
      /* role: "ADMIN", */
      /* isVerified: true, */
    },
    project: {
      id: "cld1pg5wb0004pfe9w9bnpdn9",
      createdAt: new Date(),
      updatedAt: null,
      createdById: "clcqw3zaq0006pf5svlfa1iwg",
      endDate: null,
      updatedById: "clcqw3zaq0006pf5svlfa1iwg",
      displayName: "Pavap",
      description: "Programa de apoyo a voluntarios",
      financerName: "Arturo",
      archived: false,
      softDeleted: false,
      projectType: "SUBSIDY",
      organizationId: "clcqw4lz10008pf5s711y5uwx",
    },
    transactions: [
      {
        id: 116,
        createdAt: new Date(),
        updatedAt: null,
        exchangeRate: 7000,
        wasConvertedToOtherCurrency: false,
        updatedById: null,
        currency: "PYG",
        openingBalance: new Prisma.Decimal(10000000),
        currentBalance: new Prisma.Decimal(8318932),
        transactionAmount: new Prisma.Decimal(1681068),
        isCancellation: false,
        transactionType: "MONEY_ACCOUNT",
        moneyAccountOffsetId: null,
        cancellationId: null,
        accountId: userId ?? "",
        expenseReturnId: null,
        imbursementId: null,
        moneyAccountId: "cld1p0vwq0002pfe9r8ozfzs1",
        moneyRequestId: "cldagi67k005qpftt2ssd67m9",
        membershipId: null,
        membershipPaymentRequestId: null,
        projectId: null,
        costCategoryId: null,
        expenseReportId: null,
        searchableImage: {
          url: "https://statingstoragebrasil.blob.core.windows.net/clbmbqh3o00008x98b3v23a7e/2c96c577-01a6-4a42-8681-907593b087aa",
          imageName: imageName1,
        },
      },
      {
        id: 118,
        createdAt: new Date(),
        updatedAt: null,
        updatedById: null,
        exchangeRate: 7000,
        wasConvertedToOtherCurrency: false,
        currency: "PYG",
        openingBalance: new Prisma.Decimal(8318932),
        currentBalance: new Prisma.Decimal(9159466),
        transactionAmount: new Prisma.Decimal(840534),
        moneyAccountOffsetId: null,
        isCancellation: false,
        transactionType: "EXPENSE_RETURN",
        cancellationId: null,
        accountId: userId ?? "",
        expenseReturnId: "cldagi6870061pftttzyth6sn",
        imbursementId: null,
        moneyAccountId: "cld1p0vwq0002pfe9r8ozfzs1",
        moneyRequestId: "cldagi67k005qpftt2ssd67m9",
        membershipId: null,
        membershipPaymentRequestId: null,
        projectId: null,
        costCategoryId: null,
        expenseReportId: null,
        searchableImage: {
          url: "https://statingstoragebrasil.blob.core.windows.net/clbmbqh3o00008x98b3v23a7e/2c96c577-01a6-4a42-8681-907593b087aa",
          imageName: imageName2,
        },
      },
    ],
    moneyRequestApprovals: [],
    expenseReports: [
      {
        id: "cldagi67y005xpfttj4my35rs",
        createdAt: new Date(),
        updatedAt: null,
        wasConvertedToOtherCurrency: false,
        exchangeRate: 7000,
        facturaNumber: "9720455630179",
        amountSpent: new Prisma.Decimal(840534),
        currency: "PYG",
        comments:
          "Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals",
        wasCancelled: false,
        accountId: userId ?? "",
        moneyRequestId: "cldagi67k005qpftt2ssd67m9",
        projectId: "cld1pg5wb0004pfe9w9bnpdn9",
        taxPayerId: "cldagi67u005spftt9pqkq3y6",
        costCategoryId: "cld1pg5wc0005pfe9qkxt5amm",
        concept: "asdfgdfgsdfgs",
        taxPayer: { id: "234234234", razonSocial: "Verduras del Paraguay SA" },
      },
    ],
    expenseReturns: [
      {
        id: "cldagi6870061pftttzyth6sn",
        createdAt: new Date(),
        updatedAt: null,
        wasConvertedToOtherCurrency: false,
        exchangeRate: 7000,
        wasCancelled: false,
        currency: "PYG",
        amountReturned: new Prisma.Decimal(840534),
        moneyAccountId: "cld1p0vwq0002pfe9r8ozfzs1",
        moneyRequestId: "cldagi67k005qpftt2ssd67m9",
        accountId: userId ?? "",
      },
    ],
    organization: {
      moneyRequestApprovers: [],
      moneyAdministrators: [],
    },
  };
  return x;
};
