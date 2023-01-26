import {
  bankAccTypeOptions,
  bankNameOptions,
  ownerDocTypeOptions,
} from '@/lib/utils/SelectOptions';
import type { FormTaxPayer } from '@/lib/validations/taxtPayer.validate';
import { VStack, Divider, Text } from '@chakra-ui/react';
import React from 'react';
import type { FieldValues, Control } from 'react-hook-form';
import FormControlledSelect from '../FormControlled/FormControlledSelect';
import FormControlledText from '../FormControlled/FormControlledText';
interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: any;
}
const TaxPayerForm = ({ control, errors }: formProps<FormTaxPayer>) => {
  return (
    <VStack spacing={5}>
      <FormControlledText
        control={control}
        errors={errors}
        name="razonSocial"
        label="Razón social"
      />
      <FormControlledText
        control={control}
        errors={errors}
        name="ruc"
        label="R.U.C."
      />
      <FormControlledText
        control={control}
        errors={errors}
        name="fantasyName"
        label="Nombre de fantasía (opcional)"
      />
      <Divider />
      <Text color="gray.500">Datos para transferencia</Text>
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
    </VStack>
  );
};

export default TaxPayerForm;
