import { $Enums, Prisma } from "@prisma/client";
import { GetManyContractsType } from "./Contract.types";
import { FormContract } from "@/lib/validations/createContract.validate";
import { addMonths, format, setDate } from "date-fns";
import { FormMoneyRequest } from "@/lib/validations/moneyRequest.validate";

//Estado tiene que ser "Al dia" o "Atrasado"
//Tiene que haber tambien fecha del proximo pago y ultimo pago

export const calculateContractPaymentStatus = (
  contract: GetManyContractsType,
) => {
  const frequency = contract.frequency;
  if (frequency === "MONTHLY") {
    if (contract.moneyRequests.length === 0) {
      return { color: "orange", text: "Sin pagos" };
    }

    return { color: "green", text: "Al dia" };
  }

  return { color: "gray", text: "-" };
};

export const calculateNextContractPaymentDate = (
  contract: GetManyContractsType,
) => {
  const frequency = contract.frequency;
  if (frequency === "MONTHLY" && contract.monthlyPaymentDay) {
    if (contract.moneyRequests.length === 0) {
      return {
        color: "orange",
        text: format(
          addMonths(setDate(new Date(), contract.monthlyPaymentDay), 1),
          "dd/MM/yyyy",
        ),
      };
    }

    return { color: "green", text: "Al dia" };
  }

  return { color: "gray", text: "-" };
};
export const calculateLastPaymentDate = (contract: GetManyContractsType) => {
  //Last request sorted by date
  const frequency = contract.frequency;
  if (frequency === "MONTHLY" && contract.monthlyPaymentDay) {
    const lastRequest = contract.moneyRequests.sort((a, b) => {
      return (
        (a.operationDate ? a.operationDate.getTime() : a.createdAt.getTime()) -
        (b.operationDate ? b.operationDate.getTime() : b.createdAt.getTime())
      );
    })[0];
    if (contract.moneyRequests.length === 0 || !lastRequest) {
      return {
        color: "orange",
        text: "Sin pagos",
      };
    }
    const lastRequestDate = lastRequest.operationDate
      ? lastRequest.operationDate
      : lastRequest.createdAt;
    return { color: "gray", text: format(lastRequestDate, "dd/MM/yyyy") };
  }

  return { color: "gray", text: "-" };
};

export const transformContractForEdit = (contract: GetManyContractsType) => {
  const formContract: FormContract = {
    id: contract.id,
    amount: contract.amount,
    accountId: contract.accountId,
    contractUrl: contract.contractUrl,
    contratCategoriesId: contract.contratCategoriesId,
    costCategoryId: contract.costCategoryId,
    currency: contract.currency,
    description: contract.description,
    endDate: contract.endDate,
    frequency: contract.frequency,
    moneyRequestType: contract.moneyRequestType,
    paymentDate: contract.paymentDate,
    monthlyPaymentDay: contract.monthlyPaymentDay,
    weeklyPaymentDay: contract.weeklyPaymentDay,
    yearlyPaymentDate: contract.yearlyPaymentDate,
    remindDaysBefore: contract.remindDaysBefore,
    name: contract.name,
    projectId: contract.projectId,
    payments: contract.payments,
  };

  return formContract;
};

export const transformContractToFormMoneyRequest = (
  contract: GetManyContractsType,
  organizationId: string,
) => {
  const formContract: FormMoneyRequest = {
    id: "",
    comments: "",
    createdAt: new Date(),
    operationDate: new Date(),
    updatedAt: null,
    description: `Pago de ${contract.name}`,
    status: "PENDING",
    moneyRequestType: contract.moneyRequestType,
    currency: contract.currency,
    amountRequested: contract.amount,
    costCategoryId: contract.costCategoryId,
    accountId: "",
    projectId: contract.projectId,
    archived: false,
    softDeleted: false,
    rejectionMessage: "",
    organizationId: organizationId,
    moneyOrderNumber: null,
    contractsId: contract.id,
    wasCancelled: false,
    taxPayer: {
      razonSocial: "",
      ruc: "",
      bankInfo: {
        bankName: "BANCOP",
        accountNumber: "",
        ownerName: "",
        ownerDocType: "CI",
        ownerDoc: "",
        taxPayerId: "",
        type: "SAVINGS",
      },
    },
    facturaNumber: null,
    searchableImages: [],
  };

  return formContract;
};
