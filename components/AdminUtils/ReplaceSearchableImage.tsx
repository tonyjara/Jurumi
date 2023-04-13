import { trpcClient } from "@/lib/utils/trpcClient";
import { Button } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { searchableImage } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormControlledImageUpload from "../FormControlled/FormControlledImageUpload";
import { handleUseMutationAlerts } from "../Toasts & Alerts/MyToast";

interface ReplaceImageFormData {
  id: string;
  url: string;
  oldImageName: string;
  newImageName: string;
  userId: string; //the id of the user that uploaded the image
}
const defaultReplaceImageFormData: ReplaceImageFormData = {
  id: "",
  url: "",
  newImageName: "",
  oldImageName: "",
  userId: "",
};

export const validateReplaceImageFormData = z.object({
  id: z.string(),
  url: z.string().min(1, "Debe seleccionar una imagen"),
  newImageName: z.string(),
  oldImageName: z.string(),
  userId: z.string(),
});

const ReplaceSearchableImage = ({
  searchableImage,
}: {
  searchableImage: searchableImage | null;
}) => {
  const isAdmin = useSession().data?.user?.role === "ADMIN";
  const currentUserId = useSession().data?.user?.id;
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReplaceImageFormData>({
    defaultValues: defaultReplaceImageFormData,
    resolver: zodResolver(validateReplaceImageFormData),
  });

  const { error, mutate, isLoading } =
    trpcClient.gallery.replaceImageUrl.useMutation(
      handleUseMutationAlerts({
        successText: "Imagen reemplazada con éxito",
        callback: () => {
          reset();
          context.gallery.invalidate();
        },
      })
    );

  const submitFunc = async (data: ReplaceImageFormData) => {
    if (!searchableImage || !currentUserId) return;
    data.oldImageName = searchableImage?.imageName;
    data.userId = searchableImage?.accountId ?? currentUserId;
    mutate(data);
  };

  return (
    <>
      {isAdmin && searchableImage && currentUserId && (
        <form onSubmit={handleSubmit(submitFunc)} noValidate>
          <FormControlledImageUpload
            control={control}
            errors={errors}
            urlName="url"
            idName="newImageName"
            label="Foto para reemplazar"
            setValue={setValue}
            userId={searchableImage.accountId ?? currentUserId}
            helperText=""
          />
          <Button type="submit" isDisabled={isLoading} colorScheme="blue">
            Reemplazar
          </Button>
        </form>
      )}
    </>
  );
};

export default ReplaceSearchableImage;
