import { VStack } from '@chakra-ui/react';
import React from 'react';
import type { FieldValues, Control, FieldErrorsImpl } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import type { FormMoneyAccount } from '../../lib/validations/moneyAcc.validate';
import FormControlledText from '../FormControlled/FormControlledText';
import BankInfoForm from './BankInfo.form';

interface formProps<T extends FieldValues> {
  control: Control<T>;
  //TODO: solve why we cant use nested object in errors.
  errors: FieldErrorsImpl<any>;
}

const EditMoneyAccForm = ({ control, errors }: formProps<FormMoneyAccount>) => {
  const isCashAccount = useWatch({ control, name: 'isCashAccount' });

  return (
    <VStack spacing={5}>
      <FormControlledText
        control={control}
        errors={errors}
        name="displayName"
        label="Nombre para diferencial la cuenta"
        autoFocus={true}
      />

      {!isCashAccount && <BankInfoForm control={control} errors={errors} />}
    </VStack>
  );
};

export default EditMoneyAccForm;
