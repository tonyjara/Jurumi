import { Divider, VStack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import React from 'react';
import type { FieldValues, Control, FieldErrorsImpl } from 'react-hook-form';
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
import FormControlledText from '../FormControlled/FormControlledText';
interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
}

const MoneyRequestForm = ({ control, errors }: formProps<FormMoneyRequest>) => {
  const { data: session } = useSession();
  const user = session?.user;
  const isAdminOrMod = user?.role === 'ADMIN' || user?.role === 'MODERATOR';
  const projectId = useWatch({ control, name: 'projectId' });
  const { data: costCats } = trpcClient.project.getCostCatsForProject.useQuery(
    { projectId: projectId ?? '' },
    { enabled: !!projectId?.length }
  );
  const { data: projects } = trpcClient.project.getMany.useQuery();
  const { data: orgs } = trpcClient.org.getManyForSelect.useQuery();

  const currency = useWatch({ control, name: 'currency' });
  const status = useWatch({ control, name: 'status' });

  const projectOptions = projects?.map((proj) => ({
    value: proj.id,
    label: `${proj.displayName}`,
  }));

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
        options={moneyRequestTypeOptions ?? []}
      />
      <FormControlledText
        control={control}
        errors={errors}
        name="description"
        isTextArea={true}
        label="Concepto del desembolso"
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

      {/* THIS INPUT ARE ONLY SHOWNED TO ADMINS AND MODS */}
      <Divider pb={3} />

      {isAdminOrMod && (
        <>
          <FormControlledSelect
            control={control}
            errors={errors}
            name="projectId"
            label="Seleccione un proyecto"
            options={projectOptions ?? []}
          />
          {costCatOptions()?.length && (
            <FormControlledSelect
              control={control}
              errors={errors}
              name="costCategoryId"
              label="Linea presupuestaria"
              options={costCatOptions() ?? []}
            />
          )}
          <FormControlledSelect
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
            label="Estado del desembolso"
            options={moneyRequestStatusOptions}
          />
        </>
      )}

      {status === 'REJECTED' && (
        <FormControlledText
          control={control}
          errors={errors}
          name="rejectionMessage"
          isTextArea={true}
          label="Motivo del rechazo"
        />
      )}
    </VStack>
  );
};

export default MoneyRequestForm;
