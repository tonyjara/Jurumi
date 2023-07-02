import { Box, VStack, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import type {
  FieldValues,
  Control,
  FieldErrorsImpl,
  UseFormSetValue,
  UseFormReset,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import { currencyOptions } from "../../lib/utils/SelectOptions";
import { translateCurrencyPrefix } from "../../lib/utils/TranslatedEnums";
import { trpcClient } from "../../lib/utils/trpcClient";
import FormControlledImageUpload from "../FormControlled/FormControlledImageUpload";
import FormControlledMoneyInput from "../FormControlled/FormControlledMoneyInput";
import FormControlledFacturaNumber from "../FormControlled/FormControlledFacturaNumber";
import FormControlledRadioButtons from "../FormControlled/FormControlledRadioButtons";
import FormControlledSelect from "../FormControlled/FormControlledSelect";
import FormControlledTaxPayerId from "../FormControlled/FormControlledTaxPayerId";
import FormControlledText from "../FormControlled/FormControlledText";
import {
  FormExpenseReport,
  MockExpenseReport,
} from "../../lib/validations/expenseReport.validate";

import type { CompleteMoneyReqHome } from "@/pageContainers/home/requests/HomeRequestsPage.home.requests";
import SeedButton from "../DevTools/SeedButton";
import FormControlledNumberInput from "../FormControlled/FormControlledNumberInput";
import { Currency } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  setValue: UseFormSetValue<T>;
  moneyRequest?: CompleteMoneyReqHome;
  reset: UseFormReset<FormExpenseReport>;
  isEdit?: boolean;
  amountSpentIsBiggerThanPending: boolean;
  pendingAmount: () => Decimal;
}

const ExpenseReportForm = ({
  control,
  errors,
  moneyRequest,
  setValue,
  reset,
  isEdit,
  amountSpentIsBiggerThanPending,
  pendingAmount,
}: formProps<FormExpenseReport>) => {
  const { data: session } = useSession();
  const user = session?.user;

  const currency = useWatch({ control, name: "currency" });
  const wasConvertedToOtherCurrency = useWatch({
    control,
    name: "wasConvertedToOtherCurrency",
  });
  const projectId = useWatch({ control, name: "projectId" });

  const { data: projects } = trpcClient.project.getMany.useQuery();

  const projectOptions = projects?.map((proj) => ({
    value: proj.id,
    label: `${proj.displayName}`,
  }));

  const { data: costCats } = trpcClient.project.getCostCatsForProject.useQuery(
    { projectId: projectId ?? "" },
    { enabled: !!projectId?.length }
  );

  const costCatOptions = () =>
    costCats?.map((cat) => ({
      value: cat.id,
      label: `${cat.displayName}`,
    }));

  const firstOption = costCats ? costCats[0] : null;

  const handleCurrencyChange = (e: Currency) => {
    if (e !== moneyRequest?.currency) {
      return setValue("wasConvertedToOtherCurrency", true);
    }
    return setValue("wasConvertedToOtherCurrency", false);
  };

  return (
    <VStack spacing={5}>
      {projectId && moneyRequest && firstOption && (
        <SeedButton
          reset={reset}
          mock={() =>
            MockExpenseReport({
              moneyReqId: moneyRequest.id,
              projectId,
              costCategoryId: firstOption.id,
            })
          }
        />
      )}
      <FormControlledText
        control={control}
        errors={errors}
        name="concept"
        label="Concepto"
      />
      <FormControlledRadioButtons
        control={control}
        errors={errors}
        name="currency"
        label="Moneda"
        options={currencyOptions}
        disable={isEdit}
        onChangeMw={handleCurrencyChange}
      />

      {wasConvertedToOtherCurrency && (
        <FormControlledNumberInput
          control={control}
          errors={errors}
          name={"exchangeRate"}
          label="Tasa de cambio"
          helperText={"Un dolar equivale X guaranies"}
          disable={isEdit}
        />
      )}
      <FormControlledMoneyInput
        disable={isEdit}
        control={control}
        errors={errors}
        name={"amountSpent"}
        label="Monto"
        prefix={translateCurrencyPrefix(currency)}
        currency={currency}
        totalAmount={pendingAmount()}
      />

      {amountSpentIsBiggerThanPending && (
        <Box
          borderWidth="2px"
          borderColor={"orange"}
          w={"100%"}
          p={"10px"}
          borderRadius={"8px"}
        >
          <Text mb={"10px"} fontWeight={"bold"}>
            Su rendición excede el monto pendiente, favor ingrese sus datos.
            Jurumi creará automáticamente una orden de reembolso con la
            diferencia de esta rendición.
          </Text>
          <FormControlledTaxPayerId
            label="A la orden de:"
            control={control}
            errors={errors}
            razonSocialName="reimburseTo.razonSocial"
            rucName="reimburseTo.ruc"
            setValue={setValue}
            helperText="Ingresar ruc o C.I."
            showBankInfo={true}
            bankInfoName={"reimburseTo"}
          />
        </Box>
      )}

      <FormControlledTaxPayerId
        control={control}
        errors={errors}
        razonSocialName="taxPayer.razonSocial"
        rucName="taxPayer.ruc"
        setValue={setValue}
      />
      <FormControlledFacturaNumber
        control={control}
        errors={errors}
        name="facturaNumber"
        label="Número de factura."
      />
      {user && (
        <FormControlledImageUpload
          control={control}
          errors={errors}
          urlName="searchableImage.url"
          idName="searchableImage.imageName"
          label="Foto de su comprobante"
          setValue={setValue}
          userId={user.id}
          helperText="Favor tener en cuenta la orientación y legibilidad del documento."
        />
      )}

      <FormControlledSelect
        control={control}
        errors={errors}
        name="projectId"
        label="Seleccione un proyecto"
        options={projectOptions ?? []}
        isClearable
        disable={isEdit}
      />
      {costCatOptions()?.length && (
        <FormControlledSelect
          control={control}
          errors={errors}
          name={"costCategoryId"}
          label="Linea presupuestaria"
          options={costCatOptions() ?? []}
          isClearable
          disable={isEdit}
        />
      )}

      <FormControlledText
        control={control}
        errors={errors}
        name="comments"
        isTextArea={true}
        label="Comentarios (opcional)"
      />
    </VStack>
  );
};

export default ExpenseReportForm;
