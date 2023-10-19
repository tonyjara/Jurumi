import { projectTypeOptions } from "@/lib/utils/SelectOptions";
import { VStack } from "@chakra-ui/react";
import React from "react";
import type {
  FieldValues,
  Control,
  FieldErrorsImpl,
  UseFormSetValue,
} from "react-hook-form";
import type { FormProject } from "../../lib/validations/project.validate";
import FormControlledRadioButtons from "../FormControlled/FormControlledRadioButtons";
import FormControlledText from "../FormControlled/FormControlledText";
import CostCategoryForm from "./CostCategory.form";

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  setValue: UseFormSetValue<T>;
}

const ProjectForm = ({ control, errors, setValue }: formProps<FormProject>) => {
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
          name="acronym"
          label="Siglas"
          helperText='Las siglas son las letras que representan el nombre de su proyecto. Por ejemplo: "Proyecto de Agua Potable" se puede representar como "PAP"'
        />
        <FormControlledText
          control={control}
          errors={errors}
          name="financerName"
          label="Nombre del donante"
        />
        <FormControlledRadioButtons
          control={control}
          errors={errors}
          name="projectType"
          label="Tipo de proyecto"
          options={projectTypeOptions}
        />
        <FormControlledText
          control={control}
          errors={errors}
          name="description"
          isTextArea={true}
          label="Descripción del proyecto"
        />
      </VStack>
      <CostCategoryForm setValue={setValue} control={control} errors={errors} />
    </>
  );
};

export default ProjectForm;
