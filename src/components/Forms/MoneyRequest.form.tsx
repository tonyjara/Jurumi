import { Divider, VStack, Text } from '@chakra-ui/react';
import type {
  MoneyRequest,
  MoneyRequestStatus,
  MoneyRequestType,
} from '@prisma/client';
import { useSession } from 'next-auth/react';
import React from 'react';
import type {
  FieldValues,
  Control,
  FieldErrorsImpl,
  SetFieldValue,
} from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { currencyOptions } from '../../lib/utils/SelectOptions';
import { translateCurrencyPrefix } from '../../lib/utils/TranslatedEnums';
import { trpcClient } from '../../lib/utils/trpcClient';
import type { moneyRequestValidateData } from '../../lib/validations/moneyRequest.validate';
import FormControlledImageUpload from '../FormControlled/FormControlledImageUpload';
import FormControlledMoneyInput from '../FormControlled/FormControlledMoneyInput';

import FormControlledRadioButtons from '../FormControlled/FormControlledRadioButtons';
import FormControlledSelect from '../FormControlled/FormControlledSelect';
import FormControlledText from '../FormControlled/FormControlledText';
interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  setValue: SetFieldValue<T>;
}

const MoneyRequestForm = ({
  control,
  errors,
  setValue,
}: formProps<moneyRequestValidateData>) => {
  const { data: session } = useSession();

  const isAdminOrMod =
    session?.user.role === 'ADMIN' || session?.user.role === 'MODERATOR';
  const { data: projects } = trpcClient.project.getMany.useQuery();
  const { data: orgs } = trpcClient.org.getManyForSelect.useQuery();

  const currency = useWatch({ control, name: 'currency' });
  const status = useWatch({ control, name: 'status' });
  const requestType = useWatch({ control, name: 'moneyRequestType' });

  const projectOptions = projects?.map((proj) => ({
    value: proj.id,
    label: `${proj.displayName}`,
  }));

  const statusOptions: { value: MoneyRequestStatus; label: string }[] = [
    { value: 'ACCEPTED', label: 'Aceptado' },
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'REJECTED', label: 'Rechazado' },
  ];
  const moneyRequestTypeOptions: { value: MoneyRequestType; label: string }[] =
    [
      { value: 'FUND_REQUEST', label: 'Solicitud de Adelanto' },
      { value: 'MONEY_ORDER', label: 'Orden de pago' },
      { value: 'REIMBURSMENT_ORDER', label: 'Solicitud de re-embolso' },
    ];

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
      {requestType === 'REIMBURSMENT_ORDER' && (
        <>
          <Divider pb={3} />
          <Text fontWeight={'bold'} color={'gray.400'} alignSelf={'start'}>
            Justificación de reembolso.
          </Text>
          <FormControlledText
            control={control}
            errors={errors}
            name="facturaNumber"
            label="Número de factura."
          />
          <FormControlledImageUpload
            control={control}
            errors={errors}
            name="facturaNumber"
            label="Arrastrue."
            setValue={setValue}
          />
        </>
      )}

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
            options={statusOptions}
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
