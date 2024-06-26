import { VStack } from '@chakra-ui/react';
import React from 'react';
import type { FieldValues, Control } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { currencyOptions } from '../../lib/utils/SelectOptions';
import { translateCurrencyPrefix } from '../../lib/utils/TranslatedEnums';
import type { FormMoneyAccount } from '../../lib/validations/moneyAcc.validate';
import FormControlledMoneyInput from '../FormControlled/FormControlledMoneyInput';

import FormControlledRadioButtons from '../FormControlled/FormControlledRadioButtons';
import FormControlledSwitch from '../FormControlled/FormControlledSwitch';
import FormControlledText from '../FormControlled/FormControlledText';
import BankInfoForm from './BankInfo.form';

interface formProps<T extends FieldValues> {
  control: Control<T>;
  //TODO: solve why we cant use nested object in errors.
  errors: any;
}

const MoneyAccForm = ({ control, errors }: formProps<FormMoneyAccount>) => {
  const currency = useWatch({ control, name: 'currency' });
  const isCashAccount = useWatch({ control, name: 'isCashAccount' });

  return (
    <VStack spacing={5}>
      <FormControlledText
        control={control}
        errors={errors}
        name="displayName"
        label="Nombre para diferenciar la cuenta"
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
        name="initialBalance"
        label="Balance Inicial"
        prefix={translateCurrencyPrefix(currency)}
        currency={currency}
        helperText={
          'Una vez creada la cuenta este valor NO se puede modificar.'
        }
      />
      <FormControlledSwitch
        control={control}
        errors={errors}
        name="isCashAccount"
        label="Tipo de cuenta:  Bancaria - Caja chica"
      />
      {!isCashAccount && <BankInfoForm control={control} errors={errors} />}
    </VStack>
  );
};

export default MoneyAccForm;
