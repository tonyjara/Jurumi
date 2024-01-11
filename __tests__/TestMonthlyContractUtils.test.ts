import { handleContractPaymentDayInfo } from "@/pageContainers/mod/contracts/ContractsUtils";
import { monthlyContractMock } from "./mocks/ContractMocks";
import { set } from "date-fns";

describe("Test all cases for contract util for months", () => {
  it("Start month should be paid if contract day is before month pay day", () => {
    let contract = JSON.parse(JSON.stringify(monthlyContractMock));
    contract.monthlyPaymentDay = 10;
    contract.contractStartDate = set(new Date(), { date: 1 });
    const result = handleContractPaymentDayInfo(contract);
    expect(result.text).toBe("Falta 1 pago");
  });
  it("Start month should NOT be paid if contract day is after month pay day", () => {
    let contract = JSON.parse(JSON.stringify(monthlyContractMock));
    contract.monthlyPaymentDay = 1;
    contract.contractStartDate = set(new Date(), { date: 10 });
    const result = handleContractPaymentDayInfo(contract);
    expect(result.text).toBe("Al día");
  });
  it("Should say how many months are missing when no payments", () => {
    let contract = JSON.parse(JSON.stringify(monthlyContractMock));
    const testDate = set(new Date(), { year: 2022, month: 11, date: 10 });
    contract.monthlyPaymentDay = 1;
    contract.contractStartDate = set(new Date(), {
      year: 2023,
      month: 12,
      date: 10,
    });
    const result = handleContractPaymentDayInfo(contract, testDate);
    expect(result.text).toBe("Faltan 13 pagos");
  });
});
