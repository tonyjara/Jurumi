import { currencyOptions } from "@/lib/utils/SelectOptions";
import { translateCurrencyPrefix } from "@/lib/utils/TranslatedEnums";
import { trpcClient } from "@/lib/utils/trpcClient";
import { Text, Button, ButtonGroup, Stack, Divider } from "@chakra-ui/react";
import { searchableImage } from "@prisma/client";
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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    defaultValues: {},
    /* resolver: zodResolver(validateOrganization), */
  });
  const handleCloseForm = () => {
    reset();
    setEditMode(false);
  };
  const { error, mutate, isLoading } = trpcClient.org.create.useMutation(
    handleUseMutationAlerts({
      successText: "Su organización ha sido creada! 🔥",
      callback: () => {
        handleCloseForm();
        context.org.invalidate();
      },
    })
  );

  const submitFunc = async (data: any) => {
    console.log(data);
    /* mutate(data); */
  };
  return (
    <Stack marginTop={"20px"}>
      <Divider />
      <Text fontSize={"2xl"} fontWeight="bold">
        Editar imagen
      </Text>
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
        name={"amountRequested"}
        label="Monto solicitado"
        prefix={translateCurrencyPrefix(searchableImage?.currency)}
        currency={searchableImage?.currency}
      />

      <FormControlledFacturaNumber
        control={control}
        errors={errors}
        name={"facturaNumber"}
        label={"Número de factura"}
        /* error={errorForField?.facturaNumber?.message} */
      />
      <FormControlledText
        control={control}
        errors={errors}
        name="text"
        isTextArea={true}
        label="Texto de la imagen"
      />

      <ButtonGroup onClick={handleCloseForm}>
        <Button type="submit" isDisabled={isLoading || isSubmitting}>
          Guardar
        </Button>
        <Button>Cancelar</Button>
      </ButtonGroup>
    </Stack>
  );
};
export default EditSearchableImageForm;
