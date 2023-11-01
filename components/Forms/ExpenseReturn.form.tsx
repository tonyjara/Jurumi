import { VStack, Text, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";
import type {
  FieldValues,
  Control,
  FieldErrorsImpl,
  UseFormSetValue,
  UseFormReset,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import { currencyOptions } from "../../lib/utils/SelectOptions";
import {
  translateBankDocTypes,
  translateBankNames,
  translateCurrencyPrefix,
  translatedBankAccountType,
} from "../../lib/utils/TranslatedEnums";
import { trpcClient } from "../../lib/utils/trpcClient";
import FormControlledImageUpload from "../FormControlled/FormControlledImageUpload";
import FormControlledMoneyInput from "../FormControlled/FormControlledMoneyInput";
import FormControlledRadioButtons from "../FormControlled/FormControlledRadioButtons";
import FormControlledSelect from "../FormControlled/FormControlledSelect";
import type { FormExpenseReturn } from "@/lib/validations/expenseReturn.validate";
import type { Currency } from "@prisma/client";
import { expenseReturnMock } from "@/__tests__/mocks/Mocks";
import SeedButton from "../DevTools/SeedButton";
import FormControlledNumberInput from "../FormControlled/FormControlledNumberInput";
import { CompleteMoneyReqHome } from "@/pageContainers/home/requests/home.requests.types";
import Decimal from "decimal.js";

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  setValue: UseFormSetValue<T>;
  moneyRequest?: CompleteMoneyReqHome;
  reset: UseFormReset<FormExpenseReturn>;
  pendingAmount: () => Decimal;
}

const ExpenseReturnForm = ({
  control,
  errors,
  moneyRequest,
  setValue,
  reset,
  pendingAmount,
}: formProps<FormExpenseReturn>) => {
  const { data: session } = useSession();
  const user = session?.user;

  const currency = useWatch({ control, name: "currency" });
  const wasConvertedToOtherCurrency = useWatch({
    control,
    name: "wasConvertedToOtherCurrency",
  });

  const handleCurrencyChange = (e: Currency) => {
    setValue("moneyAccountId", "");
    if (e !== moneyRequest?.currency) {
      return setValue("wasConvertedToOtherCurrency", true);
    }
    return setValue("wasConvertedToOtherCurrency", false);
  };

  const { data: moneyAccs } = trpcClient.moneyAcc.getManyPublic.useQuery();

  const moneyAccOptions = (currency: Currency) =>
    moneyAccs
      ?.filter((x) => x.currency === currency)
      .map((acc) => ({
        value: acc.id,
        label: `${acc.displayName}`,
      }));

  const accOptions = moneyAccOptions(currency);

  const moneyAccountId = useWatch({ control, name: "moneyAccountId" });
  const moneyAccount = moneyAccs?.find((x) => x.id === moneyAccountId);

  return (
    <VStack spacing={5}>
      {accOptions && accOptions[0]?.value && moneyRequest && (
        <SeedButton
          reset={reset}
          mock={() =>
            expenseReturnMock({
              moneyRequestId: moneyRequest.id,
              moneyAccountId: accOptions[0]?.value ?? "",
              amountReturned: pendingAmount(),
              currency,
            })
          }
        />
      )}
      <FormControlledRadioButtons
        control={control}
        errors={errors}
        name="currency"
        label="Moneda"
        options={currencyOptions}
        onChangeMw={handleCurrencyChange}
      />
      {wasConvertedToOtherCurrency && (
        <FormControlledNumberInput
          control={control}
          errors={errors}
          name={"exchangeRate"}
          label="Tasa de cambio"
          helperText={"Un dolar equivale X guaranies"}
        />
      )}

      <FormControlledMoneyInput
        control={control}
        errors={errors}
        name={"amountReturned"}
        label="Monto devuelto"
        prefix={translateCurrencyPrefix(currency)}
        currency={currency}
        totalAmount={pendingAmount()}
      />

      {user && (
        <FormControlledImageUpload
          control={control}
          errors={errors}
          urlName="searchableImage.url"
          idName="searchableImage.imageName"
          label="Foto de su comprobante de devolución"
          setValue={setValue}
          userId={user.id}
          helperText="Favor tener en cuenta la orientación y legibilidad del documento."
        />
      )}

      <FormControlledSelect
        control={control}
        errors={errors}
        name={"moneyAccountId"}
        label="Seleccione la cuenta que recibió la devolución"
        options={moneyAccOptions(currency) ?? []}
        isClearable={true}
      />
      {moneyAccount && moneyAccount.bankInfo && (
        <Flex w="full" gap={"10px"} alignSelf={"start"} flexDir={"column"}>
          <Text fontSize={"xl"} fontWeight={"bold"}>
            Información sobre cuenta{" "}
          </Text>
          <Flex justifyContent={"space-between"}>
            <Text>Numero de cuenta:</Text>{" "}
            <Text>
              {isNaN(parseInt(moneyAccount.bankInfo.accountNumber))
                ? moneyAccount.bankInfo.accountNumber
                : parseInt(
                    moneyAccount.bankInfo.accountNumber,
                  ).toLocaleString()}
            </Text>
          </Flex>
          <Flex justifyContent={"space-between"}>
            <Text>Tipo de cuenta: </Text>
            <Text>{translatedBankAccountType(moneyAccount.bankInfo.type)}</Text>
          </Flex>
          <Flex justifyContent={"space-between"}>
            <Text>Banco: </Text>
            <Text>{translateBankNames(moneyAccount.bankInfo?.bankName)}</Text>
          </Flex>
          <Flex justifyContent={"space-between"}>
            <Text>Tipo de documento: </Text>
            <Text>
              {translateBankDocTypes(moneyAccount.bankInfo?.ownerDocType)}
            </Text>
          </Flex>
          <Flex justifyContent={"space-between"}>
            <Text>Documento:</Text>
            <Text>
              {isNaN(parseInt(moneyAccount.bankInfo.ownerDoc))
                ? moneyAccount.bankInfo.ownerDoc
                : parseInt(moneyAccount.bankInfo?.ownerDoc).toLocaleString()}
            </Text>
          </Flex>
        </Flex>
      )}
    </VStack>
  );
};

export default ExpenseReturnForm;
