import { GetManyContractsType } from "./Contract.types";
import { FormContract } from "@/lib/validations/createContract.validate";
import { FormMoneyRequest } from "@/lib/validations/moneyRequest.validate";
import { handleMonthlyContractPaymentDayInfo } from "./ContractsUtils/MonthlyContractUtils";
import { format } from "date-fns";
import { MonthsInContract } from "./Monthly/ContractMonthlyRequestsTable";

//Estado tiene que ser "Al dia" o "Atrasado"
//Tiene que haber tambien fecha del proximo pago y ultimo pago

export const formatContractPaymentDate = (contract: GetManyContractsType) => {
  const frequency = contract.frequency;
  if (frequency === "MONTHLY") {
    return {
      color: "gray",
      text:
        contract.monthlyPaymentDay === 0
          ? "Fin de cada mes"
          : `El ${contract.monthlyPaymentDay} de cada mes`,
    };
  }

  return { color: "gray", text: "-" };
};

export const handleContractPaymentDayInfo = (
  contract: GetManyContractsType,
  testDate?: Date, // For testing purposes
) => {
  if (contract.frequency === "MONTHLY") {
    return handleMonthlyContractPaymentDayInfo(contract, testDate);
  }
  return {
    color: "gray",
    text: "-",
  };
};

export const calculateLastPaymentDate = (contract: GetManyContractsType) => {
  //Last request sorted by date
  const frequency = contract.frequency;
  if (frequency === "MONTHLY" && contract.monthlyPaymentDay) {
    const lastRequest = contract.moneyRequests.sort((a, b) => {
      return (
        (b.operationDate ? b.operationDate.getTime() : b.createdAt.getTime()) -
        (a.operationDate ? a.operationDate.getTime() : a.createdAt.getTime())
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
    return {
      color: "gray",
      text: `Último pago: ${format(lastRequestDate, "dd/MM/yyyy")}`,
    };
  }

  return { color: "gray", text: "-" };
};

export const transformContractForEdit = (contract: GetManyContractsType) => {
  const formContract: FormContract = {
    id: contract.id,
    amount: contract.amount,
    accountId: contract.accountId,
    contractUrl: contract.contractUrl,
    contractStartDate: contract.contractStartDate,
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

export const transformContractToFormMoneyRequest = ({
  contract,
  organizationId,
  monthData,
}: {
  contract: GetManyContractsType;
  organizationId: string;
  monthData?: MonthsInContract;
}) => {
  const formContract: FormMoneyRequest = {
    id: "",
    comments: "",
    createdAt: new Date(),
    operationDate: monthData ? monthData.contractStartInMonthDate : new Date(),
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
