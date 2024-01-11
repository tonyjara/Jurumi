import FormControlledDatePicker from "@/components/FormControlled/FormControlledDatePicker";
import FormControlledNumberInput from "@/components/FormControlled/FormControlledNumberInput";
import FormControlledSelect from "@/components/FormControlled/FormControlledSelect";
import ContractPaymentsForm from "@/components/Forms/ContractPayments.form";
import {
  contractFrequencyOptions,
  daysOfTheWeekOptions,
} from "@/lib/utils/SelectOptions";
import { FormContract } from "@/lib/validations/createContract.validate";
import React from "react";
import {
  Control,
  FieldErrors,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";

const ContractsPaymentFrequency = ({
  control,
  errors,
  setValue,
}: {
  control: Control<FormContract>;
  errors: FieldErrors<FormContract>;
  setValue: UseFormSetValue<FormContract>;
}) => {
  const frequency = useWatch({ control, name: "frequency" });
  return (
    <>
      <FormControlledSelect
        control={control}
        errors={errors}
        name={"frequency"}
        label="Frecuencia de pago"
        options={contractFrequencyOptions ?? []}
      />
      {/* NOTE: When frequency is "ONCE"  */}
      <FormControlledDatePicker
        name="paymentDate"
        control={control}
        errors={errors}
        label="Fecha de pago"
        hidden={frequency !== "ONCE"}
        helperText="Día en el que se realiza el pago."
      />
      {/* NOTE: When frequency is "WEEKLY"  */}
      <FormControlledSelect
        control={control}
        errors={errors}
        name={"weeklyPaymentDay"}
        label={"Dia de la semana del pago"}
        hidden={frequency !== "WEEKLY"}
        options={daysOfTheWeekOptions ?? []}
      />
      {/* NOTE: When frequency is "BIWEEKLY"  */}
      <FormControlledSelect
        control={control}
        errors={errors}
        name={"weeklyPaymentDay"}
        label={"Dia bisemanal del pago"}
        hidden={frequency !== "BIWEEKLY"}
        options={daysOfTheWeekOptions ?? []}
      />
      {/* NOTE: When frequency is "MONTHLY"  */}
      <FormControlledNumberInput
        name="monthlyPaymentDay"
        control={control}
        errors={errors}
        label="Día de pago"
        maxLength={2}
        hidden={frequency !== "MONTHLY"}
        helperText="Día del mes en el que se realiza el pago."
      />
      {/* NOTE: When frequency is "YEARLY"  */}
      <FormControlledDatePicker
        name="yearlyPaymentDate"
        control={control}
        errors={errors}
        label="Fecha anual de pago"
        hidden={frequency !== "YEARLY"}
        helperText="Día del año en el que se realiza el pago."
      />

      {frequency === "VARIABLE" && (
        <ContractPaymentsForm
          control={control}
          errors={errors}
          setValue={setValue}
        />
      )}
    </>
  );
};

export default ContractsPaymentFrequency;
