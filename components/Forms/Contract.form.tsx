import {
  contractFrequencyOptions,
  currencyOptions,
  moneyRequestTypeOptions,
} from "@/lib/utils/SelectOptions";
import { Heading, VStack, Text, Flex, Divider } from "@chakra-ui/react";
import React from "react";
import {
  type FieldValues,
  type Control,
  type FieldErrorsImpl,
  type UseFormSetValue,
  useWatch,
} from "react-hook-form";
import FormControlledRadioButtons from "../FormControlled/FormControlledRadioButtons";
import FormControlledText from "../FormControlled/FormControlledText";
import { FormContract } from "@/lib/validations/createContract.validate";
import { translateCurrencyPrefix } from "@/lib/utils/TranslatedEnums";
import ContractCategoriesSelect from "@/pageContainers/mod/contracts/ContractCategoriesSelect";
import FormControlledMoneyInput from "../FormControlled/FormControlledMoneyInput";
import FormControlledSelect from "../FormControlled/FormControlledSelect";
import { trpcClient } from "@/lib/utils/trpcClient";
import FormControlledDatePicker from "../FormControlled/FormControlledDatePicker";
import FormControlledNumberInput from "../FormControlled/FormControlledNumberInput";
import ContractsPaymentFrequency from "@/pageContainers/mod/contracts/ContractsPaymentFrequency";

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  setValue: UseFormSetValue<T>;
}

const ContractForm = ({
  control,
  errors,
  setValue,
}: formProps<FormContract>) => {
  const projectId = useWatch({
    control,
    name: "projectId",
  });
  const moneyRequestType = useWatch({
    control,
    name: "moneyRequestType",
  });
  const currency = useWatch({
    control,
    name: "currency",
  });
  const frequency = useWatch({
    control,
    name: "frequency",
  });

  const { data: accounts } = trpcClient.account.getManyForSelect.useQuery();
  const { data: projects } = trpcClient.project.getMany.useQuery();
  const { data: costCats } = trpcClient.project.getCostCatsForProject.useQuery(
    { projectId: projectId ?? "" },
    { enabled: !!projectId?.length },
  );

  const accountsOptions = accounts?.map((acc) => ({
    value: acc.id,
    label: `${acc.displayName}`,
  }));
  const projectOptions = projects?.map((proj) => ({
    value: proj.id,
    label: `${proj.displayName}`,
  }));

  const costCatOptions = costCats?.map((cat) => ({
    value: cat.id,
    label: `${cat.displayName}`,
  }));

  return (
    <>
      <VStack spacing={10}>
        {/* {prefs?.selectedOrganization && ( */}
        {/*   <SeedButton */}
        {/*     reset={reset} */}
        {/*     mock={() => */}
        {/*       moneyAccMock({ organizationId: prefs?.selectedOrganization }) */}
        {/*     } */}
        {/*   /> */}
        {/* )} */}
        {/* {error && <Text color="red.300">{knownErrors(error.message)}</Text>} */}
        <FormControlledText
          control={control}
          errors={errors}
          name="name"
          label="Nombre del contrato"
        />
        <FormControlledText
          control={control}
          errors={errors}
          name="description"
          isTextArea={true}
          label="Descripción del contrato"
        />
        <FormControlledText
          control={control}
          errors={errors}
          name="contractUrl"
          label="Link del contrato"
          helperText="Link del contrato, puede ser un link a google drive, dejar en blanco si no tiene link."
        />
        <Flex flexDir={"column"} gap="10px" w="full">
          <Divider my={"10px"} />
          <Heading size="md">Fechas y recordatorios</Heading>
          <Text color={"gray.500"}>
            Los contratos pueden ser en perpetuidad, como un pago de Internet, o
            con distintas frecuencias. Asi como con distintas fechas de pago. Al
            colocar una fecha de recordatorio se ajusta la fecha del próximo
            pago. Al exceder la fecha del contrato se considera atrasado.
          </Text>
        </Flex>
        <FormControlledDatePicker
          name="contractStartDate"
          hidden={frequency === "ONCE" || frequency === "VARIABLE"}
          control={control}
          errors={errors}
          label="Fecha de inicio"
          helperText="Fecha en que inicia el contrato."
        />
        <ContractsPaymentFrequency
          control={control}
          errors={errors}
          setValue={setValue}
        />
        <FormControlledNumberInput
          name="remindDaysBefore"
          control={control}
          errors={errors}
          hidden={frequency === "ONCE" || frequency === "VARIABLE"}
          maxLength={3}
          label="Días de anticipación para recordar"
          helperText='Días de anticipación para recordar el "Próximo pago". Si es 0, se recordará en la fecha del pago.'
        />
        <FormControlledDatePicker
          name="endDate"
          hidden={frequency === "ONCE" || frequency === "VARIABLE"}
          control={control}
          errors={errors}
          label="Fecha de finalización"
          helperText="Fecha en la que finaliza el contrato, dejar en blanco si no tiene fecha de finalización."
        />
        <ContractCategoriesSelect
          setValue={setValue}
          control={control}
          errors={errors}
        />

        <Flex flexDir={"column"} gap="10px">
          <Divider my={"10px"} />
          <Heading size="md">Datos de solicitud</Heading>
          <Text color={"gray.500"}>
            Los datos ingresados aquí serán utilizados para autocompletar la
            solicitud al crearse.
          </Text>
        </Flex>

        <FormControlledSelect
          control={control}
          errors={errors}
          name="moneyRequestType"
          label="Tipo de solicitud"
          /* disable={isEdit} */
          options={moneyRequestTypeOptions ?? []}
        />
        <FormControlledSelect
          /* disable={isEdit} */
          control={control}
          errors={errors}
          name="projectId"
          label="Seleccione un proyecto"
          options={projectOptions ?? []}
          isClearable
        />
        <FormControlledSelect
          control={control}
          errors={errors}
          name={"costCategoryId"}
          label="Linea presupuestaria"
          options={costCatOptions ?? []}
          isClearable
          disable={moneyRequestType === "FUND_REQUEST"}
        />
        <FormControlledSelect
          /* disable={isEdit} */
          control={control}
          errors={errors}
          name="accountId"
          label="Seleccione un usuario"
          options={accountsOptions ?? []}
          isClearable
        />
        {moneyRequestType !== "REIMBURSMENT_ORDER" && (
          <>
            <FormControlledRadioButtons
              control={control}
              errors={errors}
              name="currency"
              label="Moneda"
              hidden={frequency === "VARIABLE"}
              options={currencyOptions}
            />
            <FormControlledMoneyInput
              control={control}
              errors={errors}
              hidden={frequency === "VARIABLE"}
              name={"amount"}
              label="Monto del contrato"
              prefix={translateCurrencyPrefix(currency)}
              currency={currency}
            />
          </>
        )}
      </VStack>
    </>
  );
};

export default ContractForm;
