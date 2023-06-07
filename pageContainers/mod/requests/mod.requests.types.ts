import {
  Account,
  CostCategory,
  ExpenseReport,
  ExpenseReturn,
  MoneyRequest,
  MoneyRequestApproval,
  Project,
  searchableImage,
  TaxPayerBankInfo,
  Transaction,
} from "@prisma/client";

export type MoneyRequestComplete = MoneyRequest & {
  account: Account;
  organization: {
    moneyAdministrators: {
      id: string;
      displayName: string;
    }[];
    moneyRequestApprovers: {
      id: string;
      displayName: string;
    }[];
  };

  project: Project | null;
  costCategory: CostCategory | null;
  taxPayer: {
    id: string;
    bankInfo: TaxPayerBankInfo | null;
    razonSocial: string;
    ruc: string;
  } | null;
  transactions: (Transaction & {
    searchableImage: {
      url: string;
      imageName: string;
    } | null;
  })[];
  expenseReports: (ExpenseReport & {
    taxPayer: {
      id: string;
      razonSocial: string;
    };
  })[];
  searchableImages: searchableImage[];
  expenseReturns: ExpenseReturn[];
  moneyRequestApprovals: MoneyRequestApproval[];
};
