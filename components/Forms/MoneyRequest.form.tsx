import { Divider, VStack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import React from 'react';
import type {
  FieldValues,
  Control,
  FieldErrorsImpl,
  UseFormSetValue,
} from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import {
  currencyOptions,
  moneyRequestStatusOptions,
  moneyRequestTypeOptions,
} from '../../lib/utils/SelectOptions';
import { translateCurrencyPrefix } from '../../lib/utils/TranslatedEnums';
import { trpcClient } from '../../lib/utils/trpcClient';
import type { FormMoneyRequest } from '../../lib/validations/moneyRequest.validate';
import FormControlledMoneyInput from '../FormControlled/FormControlledMoneyInput';
import FormControlledRadioButtons from '../FormControlled/FormControlledRadioButtons';
import FormControlledSelect from '../FormControlled/FormControlledSelect';
import FormControlledTaxPayerId from '../FormControlled/FormControlledTaxPayerId';
import FormControlledText from '../FormControlled/FormControlledText';
import FormControlledImageUpload from '../FormControlled/FormControlledImageUpload';
import FormControlledFacturaNumber from '../FormControlled/FormControlledFacturaNumber';
interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  setValue: UseFormSetValue<T>;
  isEdit?: boolean;
}

const MoneyRequestForm = ({
  control,
  errors,
  setValue,
  isEdit,
}: formProps<FormMoneyRequest>) => {
  const { data: session } = useSession();
  const user = session?.user;
  const isAdminOrMod = user?.role === 'ADMIN' || user?.role === 'MODERATOR';

  const currency = useWatch({ control, name: 'currency' });
  const status = useWatch({ control, name: 'status' });
  const projectId = useWatch({ control, name: 'projectId' });
  const moneyRequestType = useWatch({ control, name: 'moneyRequestType' });

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
    { projectId: projectId ?? '' },
    { enabled: !!projectId?.length }
  );

  const costCatOptions = () =>
    costCats?.map((cat) => ({
      value: cat.id,
      label: `${cat.displayName}`,
    }));

  return (
    <VStack spacing={5}>
      <FormControlledSelect
        control={control}
        errors={errors}
        name="moneyRequestType"
        label="Tipo de solicitud"
        disable={isEdit}
        options={moneyRequestTypeOptions ?? []}
      />
      {(moneyRequestType === 'MONEY_ORDER' ||
        moneyRequestType === 'REIMBURSMENT_ORDER') && (
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
          {moneyRequestType === 'REIMBURSMENT_ORDER' && (
            <>
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

      <FormControlledRadioButtons
        control={control}
        errors={errors}
        name="currency"
        label="Moneda"
        options={currencyOptions}
      />
      <FormControlledMoneyInput
        control={control}
        errors={errors}
        name={'amountRequested'}
        label="Monto solicitado"
        prefix={translateCurrencyPrefix(currency)}
        currency={currency}
      />

      <FormControlledSelect
        disable={isEdit}
        control={control}
        errors={errors}
        name="projectId"
        label="Seleccione un proyecto"
        options={projectOptions ?? []}
        isClearable
      />
      {moneyRequestType !== 'FUND_REQUEST' && costCatOptions()?.length && (
        <FormControlledSelect
          control={control}
          errors={errors}
          name={'costCategoryId'}
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
      {isAdminOrMod && (
        <>
          <Divider pb={3} />

          <FormControlledSelect
            disable={isEdit}
            control={control}
            errors={errors}
            name="organizationId"
            label="Seleccione una organización"
            options={orgs ?? []}
            optionLabel={'displayName'}
            optionValue={'id'}
            isClearable
          />
          <FormControlledRadioButtons
            control={control}
            errors={errors}
            name="status"
            label="Estado de la soliciutd"
            options={moneyRequestStatusOptions}
          />
          {status === 'REJECTED' && (
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
