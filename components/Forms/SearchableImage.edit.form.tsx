import { knownErrors } from "@/lib/dictionaries/knownErrors";
import { currencyOptions } from "@/lib/utils/SelectOptions";
import { translateCurrencyPrefix } from "@/lib/utils/TranslatedEnums";
import { trpcClient } from "@/lib/utils/trpcClient";
import {
  defaultSeachableImageEditData,
  FormSearchableImageEdit,
  validateSearchableImageEdit,
} from "@/lib/validations/searchableImage.edit.validate";
import { Text, Button, ButtonGroup, Stack, Divider } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchableImage } from "@prisma/client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormControlledFacturaNumber from "../FormControlled/FormControlledFacturaNumber";
import FormControlledMoneyInput from "../FormControlled/FormControlledMoneyInput";
import FormControlledRadioButtons from "../FormControlled/FormControlledRadioButtons";
import FormControlledText from "../FormControlled/FormControlledText";
import { handleUseMutationAlerts } from "../Toasts & Alerts/MyToast";

const EditSearchableImageForm = ({
  searchableImage,
  setEditMode,
}: {
  searchableImage: searchableImage;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const context = trpcClient.useContext();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    defaultValues: defaultSeachableImageEditData,
    resolver: zodResolver(validateSearchableImageEdit),
  });

  const handleCloseForm = () => {
    reset(defaultSeachableImageEditData);
    setEditMode(false);
  };
  const { error, mutate, isLoading } =
    trpcClient.searchableImage.edit.useMutation(
      handleUseMutationAlerts({
        successText: "Su imágen ha sido editada",
        callback: () => {
          handleCloseForm();
          context.invalidate();
        },
      })
    );

  const submitFunc = async (data: FormSearchableImageEdit) => {
    mutate(data);
  };
  useEffect(() => {
    if (!searchableImage) return;
    reset({
      ...defaultSeachableImageEditData,
      id: searchableImage.id,
      currency: searchableImage.currency,
      amount: searchableImage.amount,
      facturaNumber: searchableImage.facturaNumber,
      text: searchableImage.text,
    });

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchableImage]);

  return (
    <form onSubmit={handleSubmit(submitFunc)} noValidate>
      <Stack marginTop={"20px"}>
        <Divider />
        <Text fontSize={"2xl"} fontWeight="bold">
          Editar imagen
        </Text>

        {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
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
          name={"amount"}
          label="Monto solicitado"
          prefix={translateCurrencyPrefix(searchableImage?.currency)}
          currency={searchableImage?.currency}
        />

        <FormControlledFacturaNumber
          control={control}
          errors={errors}
          name={"facturaNumber"}
          label={"Número de factura"}
        />
        <FormControlledText
          control={control}
          errors={errors}
          name="text"
          isTextArea={true}
          label="Texto de la imagen"
        />

        <ButtonGroup justifyContent={"space-between"}>
          <Button onClick={handleCloseForm}>Cancelar</Button>

          <Button type="submit" isDisabled={isLoading || isSubmitting}>
            Guardar
          </Button>
        </ButtonGroup>
      </Stack>
    </form>
  );
};
export default EditSearchableImageForm;
