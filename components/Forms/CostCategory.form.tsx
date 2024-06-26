import { currencyOptions } from "@/lib/utils/SelectOptions";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Divider, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import React from "react";
import type {
  FieldValues,
  Control,
  FieldErrorsImpl,
  UseFormSetValue,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { translateCurrencyPrefix } from "../../lib/utils/TranslatedEnums";
import type { FormProject } from "../../lib/validations/project.validate";
import { defaultCostCategoryData } from "../../lib/validations/project.validate";
import FormControlledMoneyInput from "../FormControlled/FormControlledMoneyInput";
import FormControlledNumberInput from "../FormControlled/FormControlledNumberInput";
import FormControlledRadioButtons from "../FormControlled/FormControlledRadioButtons";
import FormControlledText from "../FormControlled/FormControlledText";

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  setValue: UseFormSetValue<T>;
}

const CostCategoryForm = ({
  control,
  errors,
  setValue,
}: formProps<FormProject>) => {
  const { fields, prepend, remove } = useFieldArray({
    control,
    name: "costCategories",
  });

  const watchedFields = useWatch({ control, name: "costCategories" });

  return (
    <>
      <Divider my={"10px"} />
      <HStack justifyContent={"space-between"}>
        <Text fontSize={"lg"} fontWeight="bold">
          {" "}
          Lineas presupuestarias
        </Text>
        <IconButton
          onClick={() => prepend(defaultCostCategoryData)}
          aria-label="add"
          icon={<AddIcon />}
        />
      </HStack>
      {fields.map((x, index) => {
        const currency = watchedFields[index]?.currency;
        return (
          <VStack mt="10px" key={x.id} spacing={5}>
            <FormControlledText
              control={control}
              errors={errors}
              name={`costCategories.${index}.displayName`}
              label={`${index + 1}- Nombre`}
            />
            <HStack spacing={5}>
              <FormControlledRadioButtons
                control={control}
                errors={errors}
                name={`costCategories.${index}.currency`}
                label="Moneda"
                options={currencyOptions}
                onChangeMw={() =>
                  setValue(`costCategories.${index}.assignedAmount`, 0)
                }
              />
              <FormControlledMoneyInput
                control={control}
                errors={errors}
                name={`costCategories.${index}.assignedAmount`}
                label="Monto asignado."
                prefix={translateCurrencyPrefix(currency ?? "PYG")}
                currency={currency ?? "PYG"}
              />
              <IconButton
                onClick={() => remove(index)}
                aria-label="delete"
                icon={<DeleteIcon />}
              />
            </HStack>
            <FormControlledNumberInput
              control={control}
              errors={errors}
              prefix="1 $ = Gs. "
              name={`costCategories.${index}.referenceExchangeRate`}
              label="Valor referencial de dólar en guaranies."
              helperText={
                "Este valor se toma como referencia para calcular porcentajes de ejecución y otros datos."
              }
            />
            <Divider />
          </VStack>
        );
      })}
    </>
  );
};

export default CostCategoryForm;
