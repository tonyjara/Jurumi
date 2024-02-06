import { Box, VStack } from "@chakra-ui/react";
import React from "react";
import type {
  FieldValues,
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormGetValues,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import { translateCurrencyPrefix } from "../../lib/utils/TranslatedEnums";
import FormControlledMoneyInput from "../FormControlled/FormControlledMoneyInput";

import FormControlledImageUpload from "../FormControlled/FormControlledImageUpload";
import { useSession } from "next-auth/react";
import { FormMoneyAccountTransfer } from "@/lib/validations/moneyTransfer.validate";
import FormControlledSelect from "../FormControlled/FormControlledSelect";
import { trpcClient } from "@/lib/utils/trpcClient";
import { Currency } from "@prisma/client";
import { formatedAccountBalance } from "@/lib/utils/TransactionUtils";
import FormControlledNumberInput from "../FormControlled/FormControlledNumberInput";

interface formProps<T extends FieldValues> {
  control: Control<T>;
  //TODO: solve why we cant use nested object in errors.
  errors: FieldErrors<T>;
  setValue: UseFormSetValue<T>;
}

const MoneyTransferForm = ({
  control,
  errors,
  setValue,
}: formProps<FormMoneyAccountTransfer>) => {
  const session = useSession();
  const user = session.data?.user;
  const fromCurrency = useWatch({ control, name: "fromCurrency" });
  const toCurrency = useWatch({ control, name: "toCurrency" });

  const { data: moneyAccs, isLoading: isLoadingMoneyAccs } =
    trpcClient.moneyAcc.getManyWithTransactions.useQuery();
  const fromAccountId = useWatch({ control, name: "fromAccountId" });
  const exchangeIsDifferentCurrency = useWatch({
    control,
    name: "exchangeIsDifferentCurrency",
  });

  const allMoneyAccounts = () =>
    moneyAccs?.map((acc) => ({
      value: acc.id,
      label: `${acc.displayName} ${formatedAccountBalance(acc)} ${acc.currency}`,
      currency: acc.currency,
    }));

  const allAccountsButFromAccount = () =>
    moneyAccs
      ?.filter((x) => x.id !== fromAccountId)
      .map((acc) => ({
        value: acc.id,
        label: `${acc.displayName} ${formatedAccountBalance(acc)} ${acc.currency}`,
        currency: acc.currency,
      }));

  return (
    <VStack spacing={5}>
      <FormControlledSelect
        control={control}
        errors={errors}
        name={"fromAccountId"}
        label="Seleccione la cuenta de origen"
        options={allMoneyAccounts() ?? []}
        disable={isLoadingMoneyAccs}
        isClearable={true}
        onAfterChange={(val) => {
          if (!val) {
            setValue("fromCurrency", null);
            setValue("toCurrency", null);
            setValue("toAccountId", "");
            return;
          }
          setValue("fromCurrency", val.currency);
          setValue("toCurrency", null);
          setValue("toAccountId", "");
        }}
        // error={
        //     (errors.transactions &&
        //         errors.transactions[index]?.moneyAccountId?.message) ??
        //         ""
        // }
      />
      <FormControlledSelect
        control={control}
        errors={errors}
        name={"toAccountId"}
        label="Seleccione la cuenta de destino"
        options={allAccountsButFromAccount() ?? []}
        disable={isLoadingMoneyAccs}
        isClearable={true}
        onAfterChange={(val) => {
          if (!val) {
            setValue("toCurrency", null);
            setValue("exchangeIsDifferentCurrency", false);
            return;
          }
          setValue("toCurrency", val.currency);

          if (fromCurrency !== val.currency) {
            setValue("exchangeIsDifferentCurrency", true);
          } else {
            setValue("exchangeIsDifferentCurrency", false);
          }
        }}
        // error={
        //     (errors.transactions &&
        //         errors.transactions[index]?.moneyAccountId?.message) ??
        //         ""
        // }
      />
      <FormControlledMoneyInput
        disable={!fromCurrency && !toCurrency}
        control={control}
        errors={errors}
        name={"amount"}
        label="Monto para transferir"
        prefix={translateCurrencyPrefix(fromCurrency ?? "PYG")}
        currency={fromCurrency ?? "PYG"}
      />
      {exchangeIsDifferentCurrency && (
        <FormControlledNumberInput
          control={control}
          errors={errors}
          name="exchangeRate"
          label="Tasa de cambio"
          helperText={`Valor de 1 Dólar Americano en Guaranies`}
          // disable={isEditForm}
        />
      )}

      <Box my={"20px"}>
        {user && (
          <FormControlledImageUpload
            control={control}
            errors={errors}
            urlName="searchableImage.url"
            idName="searchableImage.imageName"
            label="Comprobante del transferencia (opcional)"
            setValue={setValue}
            helperText="Favor tener en cuenta la orientación y legibilidad del documento."
            userId={user.id}
          />
        )}
      </Box>
      {/* <FormControlledMoneyInput */}
      {/*   control={control} */}
      {/*   errors={errors} */}
      {/*   name="amount" */}
      {/*   label="Balance Inicial" */}
      {/*   prefix={translateCurrencyPrefix(currency)} */}
      {/*   currency={currency } */}
      {/*   helperText={ */}
      {/*     "Una vez creada la cuenta este valor NO se puede modificar." */}
      {/*   } */}
      {/* /> */}
    </VStack>
  );
};

export default MoneyTransferForm;
