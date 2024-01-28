import { GetManyContractsType } from "@/pageContainers/mod/contracts/Contract.types";
import { Decimal } from "@prisma/client/runtime/library";

export const monthlyContractMock: GetManyContractsType = {
  payments: [],
  moneyRequests: [],
  id: 0,
  createdAt: new Date(),
  updatedAt: null,
  contractStartDate: new Date(),
  frequency: "MONTHLY",
  paymentDate: null,
  monthlyPaymentDay: null,
  yearlyPaymentDate: null,
  weeklyPaymentDay: null,
  remindDaysBefore: 0,
  endDate: null,
  wasCancelledAt: null,
  name: "",
  description: "",
  amount: new Decimal(0),
  currency: "USD",
  moneyRequestType: "MONEY_ORDER",
  contractUrl: null,
  archived: false,
  softDeleted: false,
  wasCancelled: false,
  wasFinalized: false,
  projectId: null,
  costCategoryId: null,
  contratCategoriesId: null,
  accountId: null,
};