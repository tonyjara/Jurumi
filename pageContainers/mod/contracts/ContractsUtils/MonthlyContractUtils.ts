import { differenceInMonths, addMonths, format } from "date-fns";
import { es } from "date-fns/locale";
import { GetManyContractsType } from "../Contract.types";
import { MonthsInContract } from "../Monthly/ContractMonthlyRequestsTable";
import { startCase } from "@/lib/utils/MyLodash";

export const handleMonthlyContractPaymentDayInfo = (
  contract: GetManyContractsType,
  testDate?: Date, // For testing purposes
) => {
  if (contract.frequency === "MONTHLY" && contract.monthlyPaymentDay) {
    const contractStartMonthShouldBePaid =
      contract.contractStartDate.getDate() - contract.monthlyPaymentDay < 0;

    const monthsFromContractToNow =
      Math.abs(
        differenceInMonths(contract.contractStartDate, testDate ?? new Date()),
      ) + (contractStartMonthShouldBePaid ? 1 : 0);

    let missingMonths = [];
    for (let i = 0; i < monthsFromContractToNow; i++) {
      const month = addMonths(contract.contractStartDate, i);
      const monthHasRequest = contract.moneyRequests.some((request) => {
        const requestDate = request.operationDate ?? request.createdAt;
        return (
          requestDate.getMonth() === month.getMonth() &&
          requestDate.getFullYear() === month.getFullYear()
        );
      });

      if (!monthHasRequest) {
        missingMonths.push(format(month, "yyyy MMMM", { locale: es }));
      }
    }
    if (missingMonths.length > 0) {
      return {
        color: "red",
        text:
          missingMonths.length === 1
            ? `Falta 1 pago`
            : `Faltan ${missingMonths.length} pagos`,
      };
    }

    return { color: "green", text: "Al día" };
  }
  return { color: "gray", text: "-" };
};

export const contractMonths = (contract: GetManyContractsType) => {
  const contractStartMonthShouldBePaid =
    contract.contractStartDate.getDate() - (contract?.monthlyPaymentDay ?? 0) <
    0;

  const monthsFromContractToNow =
    Math.abs(differenceInMonths(contract.contractStartDate, new Date())) +
    (contractStartMonthShouldBePaid ? 1 : 0);

  let data: MonthsInContract[] = [];
  for (let i = 0; i < monthsFromContractToNow; i++) {
    const contractStartInMonthDate = addMonths(contract.contractStartDate, i);
    const monthRequest = contract.moneyRequests.find((request) => {
      const requestDate = request.operationDate ?? request.createdAt;
      return (
        requestDate.getMonth() === contractStartInMonthDate.getMonth() &&
        requestDate.getFullYear() === contractStartInMonthDate.getFullYear()
      );
    });

    data.push({
      contractStartInMonthDate,
      formatedMonth: startCase(
        format(contractStartInMonthDate, "yyyy MMMM", { locale: es }),
      ),
      request: monthRequest ?? null,
    });
  }
  return data;
};
