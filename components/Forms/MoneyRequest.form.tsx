import { decimalFormat } from "@/lib/utils/DecimalHelpers";
import { Divider, Flex, Text, VStack } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
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
import {
  currencyOptions,
  moneyRequestStatusOptions,
  moneyRequestTypeOptions,
} from "../../lib/utils/SelectOptions";
import { translateCurrencyPrefix } from "../../lib/utils/TranslatedEnums";
import { trpcClient } from "../../lib/utils/trpcClient";
import {
  FormMoneyRequest,
  MockMoneyRequest,
} from "../../lib/validations/moneyRequest.validate";
import SeedButton from "../DevTools/SeedButton";
import FormControlledMoneyInput from "../FormControlled/FormControlledMoneyInput";
import FormControlledNumberInput from "../FormControlled/FormControlledNumberInput";
import FormControlledRadioButtons from "../FormControlled/FormControlledRadioButtons";
import FormControlledSelect from "../FormControlled/FormControlledSelect";
import FormControlledTaxPayerId from "../FormControlled/FormControlledTaxPayerId";
import FormControlledText from "../FormControlled/FormControlledText";
import ReimbursementOrderImagesForm from "./ReimbursementOrderImages.form";
interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  setValue: UseFormSetValue<T>;
  isEdit?: boolean;
  orgId: string | null;
  reset: UseFormReset<T>;
  //To be able to hook in with contracts, we need to pass the incomingMoneyRequest
  incomingMoneyRequest?: FormMoneyRequest;
}

const MoneyRequestForm = ({
  control,
  errors,
  setValue,
  isEdit,
  orgId,
  reset,
  incomingMoneyRequest,
}: formProps<FormMoneyRequest>) => {
  const { data: session } = useSession();
  const user = session?.user;
  const isAdminOrMod = user?.role === "ADMIN" || user?.role === "MODERATOR";
  const isAdmin = user?.role === "ADMIN";
  const currency = useWatch({ control, name: "currency" });
  const status = useWatch({ control, name: "status" });
  const projectId = useWatch({ control, name: "projectId" });
  const moneyRequestType = useWatch({ control, name: "moneyRequestType" });
  const searchableImages = useWatch({ control, name: "searchableImages" });

  const isAccepted = status === "ACCEPTED";

  const totalInPYG = decimalFormat(
    searchableImages.reduce((acc, val) => {
      if (val.currency !== "PYG") return acc;
      return acc.add(val.amount);
    }, new Prisma.Decimal(0)),
    "PYG",
  );
  const totalInUSD = decimalFormat(
    searchableImages.reduce((acc, val) => {
      if (val.currency !== "USD") return acc;
      return acc.add(val.amount);
    }, new Prisma.Decimal(0)),
    "USD",
  );

  const { data: projects } = trpcClient.project.getMany.useQuery();
  const { data: orgs } = isAdminOrMod
    ? trpcClient.org.getManyForSelect.useQuery({
        enabled: false,
      })
    : { data: [] };

  const projectOptions = projects?.map((proj) => ({
    value: proj.id,
    label: `${proj.displayName}`,
  }));

  const { data: costCats } = trpcClient.project.getCostCatsForProject.useQuery(
    { projectId: projectId ?? "" },
    { enabled: !!projectId?.length },
  );

  const costCatOptions = () =>
    costCats?.map((cat) => ({
      value: cat.id,
      label: `${cat.displayName}`,
    }));

  return (
    <VStack spacing={5}>
      {orgId && (
        <SeedButton
          reset={reset}
          mock={() => {
            const randomProject =
              projects?.[Math.floor(Math.random() * projects.length)];
            return MockMoneyRequest({
              organizationId: orgId,
              moneyRequestType: "FUND_REQUEST",
              projectId: randomProject?.id ?? null,
              contractsId: incomingMoneyRequest?.contractsId,
            });
          }}
        />
      )}
      <FormControlledSelect
        control={control}
        errors={errors}
        name="moneyRequestType"
        label="Tipo de solicitud"
        disable={isEdit}
        options={moneyRequestTypeOptions ?? []}
      />
      {(moneyRequestType === "MONEY_ORDER" ||
        moneyRequestType === "REIMBURSMENT_ORDER") && (
        <>
          <FormControlledTaxPayerId
            label="A la orden de:"
            control={control}
            errors={errors}
            razonSocialName="taxPayer.razonSocial"
            rucName="taxPayer.ruc"
            setValue={setValue}
            helperText="Ingresar ruc o C.I."
            showBankInfo={true}
          />
          {isEdit && isAdmin && (
            <FormControlledNumberInput
              control={control}
              errors={errors}
              name="moneyOrderNumber"
              label="Número de orden de pago"
            />
          )}
          {moneyRequestType === "REIMBURSMENT_ORDER" && (
            <>
              <ReimbursementOrderImagesForm
                control={control}
                errors={errors}
                setValue={setValue}
                isEdit={isEdit}
              />
              <Flex flexDir={"column"} justifyContent={"space-between"}>
                {currency === "PYG" && (
                  <Text fontSize={"xl"}>Total en PYG: {totalInPYG} </Text>
                )}
                {currency === "USD" && (
                  <Text fontSize={"xl"}>Total en USD: {totalInUSD} </Text>
                )}
              </Flex>
            </>
          )}
        </>
      )}
      <FormControlledText
        control={control}
        errors={errors}
        name="description"
        isTextArea={true}
        label="Concepto de la solicitud"
      />
      {moneyRequestType !== "REIMBURSMENT_ORDER" && (
        <>
          <FormControlledRadioButtons
            control={control}
            errors={errors}
            disable={isEdit && isAccepted}
            name="currency"
            label="Moneda"
            options={currencyOptions}
          />
          <FormControlledMoneyInput
            control={control}
            errors={errors}
            disable={isEdit && isAccepted}
            name={"amountRequested"}
            label="Monto solicitado"
            prefix={translateCurrencyPrefix(currency)}
            currency={currency}
          />
        </>
      )}

      <FormControlledSelect
        disable={isEdit}
        control={control}
        errors={errors}
        name="projectId"
        label="Seleccione un proyecto"
        options={projectOptions ?? []}
        isClearable
      />
      {moneyRequestType !== "FUND_REQUEST" && costCatOptions()?.length && (
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
        label="Comentarios sobre la solicitud (opcional)"
      />

      {/* THIS INPUT ARE ONLY SHOWNED TO ADMINS AND MODS */}
      {isAdmin && (
        <>
          <Divider pb={3} />

          <FormControlledSelect
            disable={isEdit}
            control={control}
            errors={errors}
            name="organizationId"
            label="Seleccione una organización"
            options={orgs ?? []}
            optionLabel={"displayName"}
            optionValue={"id"}
            isClearable
          />
          <FormControlledRadioButtons
            control={control}
            errors={errors}
            name="status"
            label="Estado de la soliciutd"
            options={moneyRequestStatusOptions}
          />
          {status === "REJECTED" && (
            <FormControlledText
              control={control}
              errors={errors}
              name="rejectionMessage"
              isTextArea={true}
              label="Motivo del rechazo"
            />
          )}
        </>
      )}
    </VStack>
  );
};

export default MoneyRequestForm;
