import { VStack } from '@chakra-ui/react';
import React from 'react';
import type {
  FieldValues,
  Control,
  FieldErrorsImpl,
  UseFormSetValue,
} from 'react-hook-form';

import type { FormOrganization } from '../../lib/validations/org.validate';
import FormControlledText from '../FormControlled/FormControlledText';

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<any>;

  setValue: UseFormSetValue<T>;
}

const EditImageDataForm = ({
  control,
  errors,
}: formProps<FormOrganization>) => {
  return (
    <VStack spacing={5}>
      <FormControlledText
        control={control}
        errors={errors}
        name="displayName"
        label="Nombre de su organización"
        autoFocus={true}
      />
    </VStack>
  );
};

export default EditImageDataForm;
