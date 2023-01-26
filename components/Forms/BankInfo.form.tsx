import { VStack } from '@chakra-ui/react';
import React from 'react';
import type { FieldValues, Control, FieldErrorsImpl } from 'react-hook-form';
import {
  bankAccTypeOptions,
  bankNameOptions,
  ownerDocTypeOptions,
} from '../../lib/utils/SelectOptions';
import type { FormMoneyAccount } from '../../lib/validations/moneyAcc.validate';
import FormControlledPhoneInput from '../FormControlled/FormControlledPhoneInput';
import FormControlledSelect from '../FormControlled/FormControlledSelect';
import FormControlledText from '../FormControlled/FormControlledText';

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
}

const BankInfoForm = ({ control, errors }: formProps<FormMoneyAccount>) => {
  // const currency = useWatch({ control, name: 'currency' });

  return (
    <VStack w={'100%'} spacing={5}>
      <FormControlledSelect
        control={control}
        errors={errors}
        name="bankInfo.type"
        label="Seleccione el tipo de cuenta"
        options={bankAccTypeOptions}
      />
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
        label="Denominación"
        autoFocus={true}
        //@ts-ignore
        error={errors.bankInfo?.ownerName?.message}
      />
      <FormControlledText
        control={control}
        errors={errors}
        name="bankInfo.accountNumber"
        label="Número de cuenta"
        //@ts-ignore
        error={errors.bankInfo?.accountNumber?.message}
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
        //@ts-ignore
        error={errors.bankInfo?.country?.message}
      />
      <FormControlledText
        control={control}
        errors={errors}
        name="bankInfo.city"
        label="Ciudad"
        //@ts-ignore
        error={errors.bankInfo?.city?.message}
      />
    </VStack>
  );
};

export default BankInfoForm;
