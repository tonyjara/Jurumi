import { VStack } from '@chakra-ui/react';
import React from 'react';
import type { FieldValues, Control, FieldErrorsImpl } from 'react-hook-form';
import type { FormProject } from '../../lib/validations/project.validate';
import FormControlledText from '../FormControlled/FormControlledText';
import CostCategoryForm from './CostCategory.form';

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
}

const ProjectForm = ({ control, errors }: formProps<FormProject>) => {
  return (
    <>
      <VStack spacing={5}>
        <FormControlledText
          control={control}
          errors={errors}
          name="displayName"
          label="Nombre de su proyecto"
        />
        <FormControlledText
          control={control}
          errors={errors}
          name="description"
          isTextArea={true}
          label="Descripción del proyecto"
        />
      </VStack>
      <CostCategoryForm control={control} errors={errors} />
    </>
  );
};

export default ProjectForm;
