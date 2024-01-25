import type {
  ApprovalStatus,
  BankAccountType,
  BankDocType,
  BankNamesPy,
  Currency,
  MemberType,
  MoneyRequestStatus,
  MoneyRequestType,
  MoneyResquestApprovalStatus,
  ProjectType,
  TransactionType,
} from "@prisma/client";

export const translateProjectType = (type: ProjectType) => {
  const types: { [key in ProjectType]?: string } = {
    SUBSIDY: "Subsidio",
    CONSULTING: "Consultoria",
  };

  return types[type] ?? "Error";
};

export const translatedBankAccountType = (type: BankAccountType) => {
  const types: { [key in BankAccountType]?: string } = {
    CURRENT: "Cuenta corriente",
    SAVINGS: "Caja de ahorro",
  };

  return types[type] ?? "Error";
};
export const translateCurrencyPrefix = (currency: Currency) => {
  const prefixes: { [key in Currency]?: string } = {
    PYG: "Gs ",
    USD: "Usd ",
  };

  return prefixes[currency] ?? "Gs ";
};

export const translateTransactionType = (transactionType: TransactionType) => {
  const x: { [key in TransactionType]?: string } = {
    COST_CATEGORY: "L. Presupuestaria",
    MONEY_ACCOUNT: "Cuenta",
    PROJECT_IMBURSEMENT: "Desembolso a proyecto",
    MONEY_ACCOUNT_IMBURSEMENT: "Desembolso a cuenta",
    EXPENSE_RETURN: "Devolución",
    OFFSET: "Ajuste",
  };

  return x[transactionType] ?? "Error";
};

export const translateCurrency = (currency: Currency) => {
  const prefixes: { [key in Currency]?: string } = {
    PYG: "Guaranies ",
    USD: "Dólares ",
  };

  return prefixes[currency] ?? "Guaranies ";
};

export const translateMemberTypes = (memberType: MemberType) => {
  const prefixes: { [key in MemberType]?: string } = {
    REGULAR: "Regular",
    VIP: "Vip ",
    FOUNDER: "Fundador",
  };

  return prefixes[memberType] ?? "Error";
};

export const translateCurrencyShort = (currency: Currency) => {
  const prefixes: { [key in Currency]?: string } = {
    PYG: "Gs. ",
    USD: "Dólares ",
  };

  return prefixes[currency] ?? "Guaranies ";
};

export const translateBankDocTypes = (docType: BankDocType) => {
  const docTypes: { [key in BankDocType]?: string } = {
    CI: "Cédula de identidad. ",
    CRC: "Crc",
    PASSPORT: "Pasaporte",
    RUC: "Ruc",
  };

  return docTypes[docType] ?? "Cédula de identidad. ";
};
export const translateBankNames = (bankName?: BankNamesPy) => {
  if (!bankName) return "";
  const bankNames: { [key in BankNamesPy]?: string } = {
    BANCOP: "Bancop",
    BANCO_ATLAS: "Banco Atlas",
    BANCO_BASA: "Banco Basa",
    BANCO_CONTINENTAL: "Banco Continental",
    BANCO_DE_LA_NACION_ARGENTINA: "Banco de la Nación Argentina",
    BANCO_DO_BRASIL: "Banco Do Brasil",
    BANCO_FAMILIAR: "Banco Familiar",
    BANCO_GNB: "Banco Gnb",
    BANCO_NACIONAL_DE_FOMENTO: "Banco Nacional de Fomento",
    BANCO_REGIONAL: "Banco Regional",
    BANCO_RIO: "Banco Rio",
    CITIBANK: "Citibank",
    COOMECIPAR: "Cooperativa Coomecipar",
    INTERFISA_BANCO: "Interfisa Banco",
    ITAU: "Itau",
    SUDAMERIS: "Sudameris",
    UENO: "Ueno",
    VISION_BANCO: "Visión Banco",
  };

  return bankNames[bankName] ?? "Itau";
};

export const translatedMoneyReqStatus = (status: MoneyRequestStatus) => {
  const x: { [key in MoneyRequestStatus]?: string } = {
    ACCEPTED: "🟩Ejecutado",
    PENDING: "🟨 Pendiente",
    REJECTED: "🟥Rechazado",
  };

  return x[status] ?? "Error ";
};
export const translatedMoneyReqType = (type: MoneyRequestType) => {
  const x: { [key in MoneyRequestType]?: string } = {
    FUND_REQUEST: "Anticipo",
    MONEY_ORDER: "Orden de pago",
    REIMBURSMENT_ORDER: "Re-embolso",
  };

  return x[type] ?? "Error ";
};

export const translatedApprovalStatus = (status: ApprovalStatus) => {
  const x: { [key in MoneyResquestApprovalStatus]?: string } = {
    ACCEPTED: "🟩Aprobado",
    PENDING: "🟨 Pendiente",
    REJECTED: "🟥Rechazado",
  };

  return x[status] ?? "Error ";
};
export const translatedMoneyRequestApprovalStatus = (
  status: MoneyResquestApprovalStatus,
) => {
  const x: { [key in MoneyResquestApprovalStatus]?: string } = {
    ACCEPTED: "🟩Aceptadas",
    PENDING: "🟨 Pendientes",
    REJECTED: "🟥Rechazadas",
  };

  return x[status] ?? "Error ";
};
