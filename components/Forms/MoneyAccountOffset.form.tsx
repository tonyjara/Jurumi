import { VStack } from "@chakra-ui/react";
import React from "react";
import type { FieldValues, Control, FieldErrorsImpl } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { currencyOptions } from "../../lib/utils/SelectOptions";
import { translateCurrencyPrefix } from "../../lib/utils/TranslatedEnums";
import { trpcClient } from "../../lib/utils/trpcClient";
import FormControlledMoneyInput from "../FormControlled/FormControlledMoneyInput";
import FormControlledRadioButtons from "../FormControlled/FormControlledRadioButtons";
import FormControlledSelect from "../FormControlled/FormControlledSelect";
import type { Currency, MoneyAccount } from "@prisma/client";
import type { FormMoneyAccounOffset } from "@/lib/validations/moneyAccountOffset.validate";
import FormControlledText from "../FormControlled/FormControlledText";
import FormControlledSwitch from "../FormControlled/FormControlledSwitch";

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
}

const MoneyAccountOffsetForm = ({
  control,
  errors,
}: formProps<FormMoneyAccounOffset>) => {
  const currency = useWatch({ control, name: "currency" });

  const { data: moneyAccs } = trpcClient.moneyAcc.getManyPublic.useQuery();

  const moneyAccOptions = (currency: Currency) =>
    moneyAccs
      ?.filter((x) => x.currency === currency)
      .map((acc) => ({
        value: acc.id,
        label: `${acc.displayName}`,
      }));

  return (
    <VStack spacing={5}>
      <FormControlledRadioButtons
        control={control}
        errors={errors}
        name="currency"
        label="Moneda"
        options={currencyOptions}
        disable={true}
      />

      <FormControlledText
        label={"Motivo del ajuste"}
        errors={errors}
        control={control}
        name="offsetJustification"
      />
      <FormControlledMoneyInput
        control={control}
        errors={errors}
        allowNegativeValue={true}
        name={"offsettedAmount"}
        label="Monto para ajustar"
        prefix={translateCurrencyPrefix(currency)}
        currency={currency}
      />
      <FormControlledSwitch
        control={control}
        errors={errors}
        name="isSubstraction"
        label="Este valor debe ser  substraido del monto de la cuenta? NO - SI"
      />

      <FormControlledSelect
        control={control}
        errors={errors}
        name={"moneyAccountId"}
        label="Cuenta para ajustart"
        options={moneyAccOptions(currency) ?? []}
        isClearable={true}
        disable={true}
      />
    </VStack>
  );
};

export default MoneyAccountOffsetForm;
