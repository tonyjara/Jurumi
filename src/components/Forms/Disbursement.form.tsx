import { VStack } from '@chakra-ui/react';
import type { Disbursement } from '@prisma/client';
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
import FormControlledMoneyInput from '../FormControlled/FormControlledMoneyInput';
import FormControlledPyInvoiceNumber from '../FormControlled/FormControlledPyInvoiceNumber';
import FormControlledRadioButtons from '../FormControlled/FormControlledRadioButtons';
import FormControlledSelect from '../FormControlled/FormControlledSelect';
import FormControlledText from '../FormControlled/FormControlledText';
import StateControlledRadioButtons from '../StateControlled/StateControlledRadioButtons';

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
  const [extractionMethod, setExtractionMethod] = useState<{
    value: string;
    label: string;
  } | null>({
    value: 'bankAcc',
    label: 'Cuenta Bancaria',
  });
  const currency = useWatch({ control, name: 'currency' });

  const options = [
    { value: 'pettyCash', label: 'Caja chica' },
    { value: 'bankAcc', label: 'Cuenta Bancaria' },
  ];
  const onChange = (x: any) => {
    setExtractionMethod(options.find((y) => y.value === x) ?? null);
    x === 'bankAcc' ? setValue('pettyCashId', null) : setValue('bankId', null);
  };

  return (
    <VStack spacing={5}>
      <StateControlledRadioButtons
        onChange={onChange}
        label="Seleccione el medio de extracción"
        options={options}
        state={extractionMethod}
      />
      {extractionMethod?.value === 'bankAcc' && (
        <FormControlledSelect
          control={control}
          errors={errors}
          name="bankId"
          label="Seleccione un banco"
          options={[]}
        />
      )}
      {extractionMethod?.value === 'pettyCash' && (
        <FormControlledSelect
          control={control}
          errors={errors}
          name="bankId"
          label="Seleccione una caja chica"
          options={[]}
        />
      )}
      <FormControlledSelect
        control={control}
        errors={errors}
        name="projectId"
        label="Seleccione un proyecto"
        options={[]}
      />
      <FormControlledRadioButtons
        control={control}
        errors={errors}
        name="status"
        label="Estado del desembolso"
        options={[]}
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
    </VStack>
  );
};

export default DisbursmentForm;
