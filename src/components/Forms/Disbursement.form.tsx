import { Divider, VStack } from '@chakra-ui/react';
import type {
  Disbursement,
  DisbursementStatus,
  DisbursementType,
} from '@prisma/client';
import React, { useState } from 'react';
import type {
  FieldValues,
  Control,
  FieldErrorsImpl,
  UseFormSetValue,
} from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { currencyOptions } from '../../lib/utils/SelectOptions';
import { translateCurrencyPrefix } from '../../lib/utils/TranslatedEnums';
import { trpcClient } from '../../lib/utils/trpcClient';
import FormControlledImageUpload from '../FormControlled/FormControlledImageUpload';
import FormControlledMoneyInput from '../FormControlled/FormControlledMoneyInput';
import FormControlledPyInvoiceNumber from '../FormControlled/FormControlledPyInvoiceNumber';
import FormControlledRadioButtons from '../FormControlled/FormControlledRadioButtons';
import FormControlledSelect from '../FormControlled/FormControlledSelect';
import FormControlledText from '../FormControlled/FormControlledText';

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  setValue: UseFormSetValue<T>;
}

const DisbursmentForm = ({
  control,
  errors,
  setValue,
}: formProps<Disbursement>) => {
  const {
    data: moneyAccs,
    // isLoading: isMoneyAccLoading,
    // error: isMoneyAccError,
  } = trpcClient.moneyAcc.getMany.useQuery();
  const {
    data: projects,
    // isLoading: isMoneyAccLoading,
    // error: isMoneyAccError,
  } = trpcClient.project.getMany.useQuery();

  const currency = useWatch({ control, name: 'currency' });

  const bankIdOptions = moneyAccs
    ?.filter((x) => x.currency === currency)
    .map((acc) => ({
      value: acc.id,
      label: `${acc.isCashAccount ? 'Caja chica:' : 'Cuenta Banc.:'} ${
        acc.displayName
      } en ${translateCurrencyPrefix(currency)}`,
    }));
  const projectOptions = projects?.map((proj) => ({
    value: proj.id,
    label: `${proj.displayName}`,
  }));

  const statusOptions: { value: DisbursementStatus; label: string }[] = [
    { value: 'ACCEPTED', label: 'Aceptado' },
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'REJECTED', label: 'Rechazado' },
  ];
  const disbursementTypeOptions: { value: DisbursementType; label: string }[] =
    [
      { value: 'ADVANCE', label: 'Adelanto' },
      { value: 'MONEY_ORDER', label: 'Orden de pago' },
      { value: 'REIMBURSMENT_ORDER', label: 'Orden de re-embolso' },
    ];

  return (
    <VStack spacing={5}>
      <FormControlledSelect
        control={control}
        errors={errors}
        name="disbursementType"
        label="Tipo de solicitud"
        options={disbursementTypeOptions ?? []}
      />
      <FormControlledText
        control={control}
        errors={errors}
        name="description"
        isTextArea={true}
        label="Concepto del desembolso"
      />

      <FormControlledPyInvoiceNumber
        control={control}
        errors={errors}
        name="facturaNumber"
        label="Número de factura"
        helperText="Ej: 001 001 0000123"
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
        name="amount"
        label="Dinero asignado."
        helperText="El dinero asignado no afecta las cuentas bancarias. Se usa para tener una referencia del total disponible."
        prefix={translateCurrencyPrefix(currency)}
        currency={currency}
      />

      <FormControlledImageUpload
        control={control}
        errors={errors}
        name="pictureUrl"
        label="Foto de su comprobante"
        helperText="Requerido en caso de Solicitur de re-embolso"
        setValue={setValue}
      />
      {/* THIS INPUT ARE ONLY SHOWNED TO ADMINS AND MODS */}
      <Divider pb={3} />
      <FormControlledSelect
        control={control}
        errors={errors}
        name="bankId"
        label="Seleccione un banco"
        options={bankIdOptions ?? []}
      />

      <FormControlledSelect
        control={control}
        errors={errors}
        name="projectId"
        label="Seleccione un proyecto"
        options={projectOptions ?? []}
      />
      <FormControlledRadioButtons
        control={control}
        errors={errors}
        name="status"
        label="Estado del desembolso"
        options={statusOptions}
      />
    </VStack>
  );
};

export default DisbursmentForm;
