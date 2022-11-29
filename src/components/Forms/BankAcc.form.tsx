import { VStack } from '@chakra-ui/react';
import type { BankAccount } from '@prisma/client';
import React from 'react';
import type { FieldValues, Control, FieldErrorsImpl } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import {
  bankNameOptions,
  ownerDocTypeOptions,
  currencyOptions,
} from '../../lib/utils/SelectOptions';
import { translateCurrencyPrefix } from '../../lib/utils/TranslatedEnums';
import FormControlledMoneyInput from '../FormControlled/FormControlledMoneyInput';
import FormControlledPhoneInput from '../FormControlled/FormControlledPhoneInput';
import FormControlledRadioButtons from '../FormControlled/FormControlledRadioButtons';
import FormControlledSelect from '../FormControlled/FormControlledSelect';
import FormControlledText from '../FormControlled/FormControlledText';

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<any>;
}

const BankAccForm = ({ control, errors }: formProps<BankAccount>) => {
  const currency = useWatch({ control, name: 'currency' });

  return (
    <VStack spacing={5}>
      <FormControlledSelect
        control={control}
        errors={errors}
        name="bankName"
        label="Seleccione el banco"
        options={bankNameOptions}
      />
      <FormControlledText
        control={control}
        errors={errors}
        name="ownerName"
        label="Nombre y Apellido del titular"
        autoFocus={true}
      />
      <FormControlledText
        control={control}
        errors={errors}
        name="accountNumber"
        label="Número de cuenta"
      />
      <FormControlledSelect
        control={control}
        errors={errors}
        name="ownerDocType"
        label="Tipo de documento"
        options={ownerDocTypeOptions}
      />
      <FormControlledText
        control={control}
        errors={errors}
        name="ownerDoc"
        label="Documento del titular"
      />
      <FormControlledPhoneInput
        control={control}
        errors={errors}
        name="ownerContactNumber"
        label="Celular del titular (Opcional)."
        helperText="Ej: 0981 123 123"
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
        name="balance"
        label="Balance Inicial"
        prefix={translateCurrencyPrefix(currency)}
        currency={currency}
      />
      <FormControlledText
        control={control}
        errors={errors}
        name="country"
        label="País"
      />
      <FormControlledText
        control={control}
        errors={errors}
        name="city"
        label="Ciudad"
      />
    </VStack>
  );
};

export default BankAccForm;
