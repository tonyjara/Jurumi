import { currencyOptions } from "@/lib/utils/SelectOptions";
import { translateCurrencyPrefix } from "@/lib/utils/TranslatedEnums";
import type { FormMoneyRequest } from "@/lib/validations/moneyRequest.validate";
import { defaultReimbursementOrderSearchableImage } from "@/lib/validations/moneyRequest.validate";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Button, Divider, Flex, IconButton, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import type {
  FieldValues,
  Control,
  FieldErrorsImpl,
  UseFormSetValue,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import FormControlledFacturaNumber from "../FormControlled/FormControlledFacturaNumber";
import FormControlledImageUpload from "../FormControlled/FormControlledImageUpload";
import FormControlledMoneyInput from "../FormControlled/FormControlledMoneyInput";
import FormControlledRadioButtons from "../FormControlled/FormControlledRadioButtons";
interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  setValue: UseFormSetValue<T>;
  isEdit?: boolean;
}

const ReimbursementOrderImagesForm = ({
  control,
  errors,
  setValue,
  isEdit,
}: formProps<FormMoneyRequest>) => {
  const [imageIsLoading, setImageIsLoading] = useState(false);
  const isAdmin = useSession().data?.user.role === "ADMIN";
  const { fields, append, remove } = useFieldArray({
    control,
    name: "searchableImages",
  });
  const user = useSession().data?.user;
  const searchableImages = useWatch({
    control,
    name: "searchableImages",
  });

  return (
    <>
      <Divider my={"10px"} />
      <Flex width={"100%"} alignItems="center" justifyContent={"space-between"}>
        <Text fontSize={"lg"} fontWeight="bold">
          {" "}
          Comprobantes
        </Text>
        <Button
          isDisabled={imageIsLoading}
          onClick={() => append(defaultReimbursementOrderSearchableImage)}
          aria-label="add"
          rightIcon={<AddIcon />}
        >
          Agregar otro comprobante
        </Button>
      </Flex>
      {fields.map((x, index) => {
        const errorForField = errors?.searchableImages?.[index];
        const currency = searchableImages[index]?.currency;
        return (
          <Flex flexDir={"column"} mt="10px" key={x.id} width="100%" gap={5}>
            <Flex width={"100%"} alignItems="center" gap={"10px"}>
              <FormControlledFacturaNumber
                control={control}
                errors={errors}
                name={`searchableImages.${index}.facturaNumber`}
                label={`${index + 1}) Número de factura. `}
                error={errorForField?.facturaNumber?.message}
              />
              <IconButton
                onClick={() => remove(index)}
                aria-label="delete images"
                icon={<DeleteIcon />}
                marginTop="22px"
              />
            </Flex>
            <FormControlledRadioButtons
              control={control}
              errors={errors}
              disable={isEdit}
              name={`searchableImages.${index}.currency`}
              label="Moneda"
              options={currencyOptions}
              error={errorForField?.currency?.message}
            />
            <FormControlledMoneyInput
              control={control}
              errors={errors}
              disable={!isAdmin && isEdit}
              name={`searchableImages.${index}.amount`}
              label={`Monto comprobante ${index + 1}`}
              prefix={translateCurrencyPrefix(currency ?? "PYG")}
              currency={currency ?? "PYG"}
              //@ts-ignore
              error={errorForField?.amount?.message}
            />

            {user && (
              <FormControlledImageUpload
                setImageIsLoading={setImageIsLoading}
                control={control}
                errors={errors}
                urlName={`searchableImages.${index}.url`}
                idName={`searchableImages.${index}.imageName`}
                label="Foto de su comprobante"
                setValue={setValue}
                userId={user.id}
                helperText="Favor tener en cuenta la orientación y legibilidad del documento."
                error={errorForField?.imageName?.message}
              />
            )}

            <Divider />
          </Flex>
        );
      })}
    </>
  );
};

export default ReimbursementOrderImagesForm;
