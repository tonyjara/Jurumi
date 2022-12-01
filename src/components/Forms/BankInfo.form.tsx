import { VStack } from '@chakra-ui/react';
import React from 'react';
import type { FieldValues, Control, FieldErrorsImpl } from 'react-hook-form';
import {
  bankNameOptions,
  ownerDocTypeOptions,
} from '../../lib/utils/SelectOptions';
import type { MoneyAccWithBankInfo } from '../../lib/validations/moneyAcc.validate';
import FormControlledPhoneInput from '../FormControlled/FormControlledPhoneInput';
import FormControlledSelect from '../FormControlled/FormControlledSelect';
import FormControlledText from '../FormControlled/FormControlledText';

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
}

const BankInfoForm = ({ control, errors }: formProps<MoneyAccWithBankInfo>) => {
  // const currency = useWatch({ control, name: 'currency' });

  return (
    <VStack w={'100%'} spacing={5}>
      <FormControlledSelect
        control={control}
        errors={errors}
        name="bankInfo.bankName"
        label="Seleccione el banco"
        options={bankNameOptions}
      />
      <FormControlledText
        control={control}
        errors={errors}
        name="bankInfo.ownerName"
        label="Nombre y Apellido del titular"
        autoFocus={true}
      />
      <FormControlledText
        control={control}
        errors={errors}
        name="bankInfo.accountNumber"
        label="Número de cuenta"
      />
      <FormControlledSelect
        control={control}
        errors={errors}
        name="bankInfo.ownerDocType"
        label="Tipo de documento"
        options={ownerDocTypeOptions}
      />
      <FormControlledText
        control={control}
        errors={errors}
        name="bankInfo.ownerDoc"
        label="Documento del titular"
      />
      <FormControlledPhoneInput
        control={control}
        errors={errors}
        name="bankInfo.ownerContactNumber"
        label="Celular del titular (Opcional)."
        helperText="Ej: 0981 123 123"
      />

      <FormControlledText
        control={control}
        errors={errors}
        name="bankInfo.country"
        label="País"
      />
      <FormControlledText
        control={control}
        errors={errors}
        name="bankInfo.city"
        label="Ciudad"
      />
    </VStack>
  );
};

export default BankInfoForm;
