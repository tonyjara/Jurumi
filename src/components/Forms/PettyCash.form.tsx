import { VStack } from '@chakra-ui/react';
import type { PettyCash } from '@prisma/client';
import React from 'react';
import type { FieldValues, Control, FieldErrorsImpl } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { currencyOptions } from '../../lib/utils/SelectOptions';
import { translateCurrencyPrefix } from '../../lib/utils/TranslatedEnums';
import FormControlledMoneyInput from '../FormControlled/FormControlledMoneyInput';
import FormControlledRadioButtons from '../FormControlled/FormControlledRadioButtons';
import FormControlledText from '../FormControlled/FormControlledText';

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
}

const PettyCashForm = ({ control, errors }: formProps<PettyCash>) => {
  const currency = useWatch({ control, name: 'currency' });

  return (
    <VStack spacing={5}>
      <FormControlledText
        control={control}
        errors={errors}
        name="displayName"
        label="Nombre de la caja chica"
        autoFocus={true}
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
        label="Balance Inicial"
        prefix={translateCurrencyPrefix(currency)}
        currency={currency}
      />
    </VStack>
  );
};

export default PettyCashForm;
