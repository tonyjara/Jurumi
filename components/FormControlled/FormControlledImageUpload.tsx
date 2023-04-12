import {
  FormControl,
  FormHelperText,
  FormErrorMessage,
  Icon,
  VisuallyHidden,
  useColorModeValue,
  HStack,
  VStack,
  FormLabel,
  Spinner,
  Flex,
  Image,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import type {
  Control,
  FieldValues,
  Path,
  SetFieldValue,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import { AiOutlineCloudUpload } from "react-icons/ai";
import uploadFileToBlob from "../../lib/utils/azure-storage-blob";
import { compressCoverPhoto } from "../../lib/utils/ImageCompressor";
import { myToast } from "../Toasts & Alerts/MyToast";
import { v4 as uuidV4 } from "uuid";
import axios from "axios";
interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: any;
  urlName: Path<T>; // the url returned from azure
  idName: Path<T>; //The uuid that gets assigned to images as name.
  label: string;
  hidden?: boolean;
  setValue: SetFieldValue<T>;
  helperText?: string;
  userId: string;
  error?: string; // escape hatch for nested objects
  setImageIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormControlledImageUpload = <T extends FieldValues>(
  props: InputProps<T>
) => {
  const {
    control,
    urlName,
    idName,
    errors,
    label,
    hidden,
    setValue,
    helperText,
    userId,
    error,
    setImageIsLoading,
  } = props;
  const [uploading, setUploading] = useState(false);
  const pictureUrl = useWatch({ control, name: urlName }) as string;
  const imageUuid = uuidV4(); //This is set on purpose here so that if there is another upload it overwrites the same picture.

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleImageUpload(acceptedFiles);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageUpload = async (files: File[]) => {
    try {
      if (!files[0]) return;
      setUploading(true);
      setImageIsLoading && setImageIsLoading(true);

      const getFile: File = files[0];
      const file = new File([getFile], imageUuid, {
        type: getFile.type,
        lastModified: getFile.lastModified,
      });
      const compressed = await compressCoverPhoto(file);
      /* const compressed = file; */

      const req = await axios("/api/get-connection-string");
      const { connectionString } = req.data;

      const url = await uploadFileToBlob(compressed, userId, connectionString);

      setValue(urlName, url);
      setValue(idName, imageUuid);
      setUploading(false);
      setImageIsLoading && setImageIsLoading(false);
    } catch (err) {
      myToast.error();
      console.error(err);
      setUploading(false);
      setImageIsLoading && setImageIsLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg"],
    },
  });
  const activeBg = useColorModeValue("gray.100", "gray.600");

  const imageNameSplit = idName.split(".");
  const imageObjectKey = imageNameSplit[0];
  const imageName = imageNameSplit[1];
  const imageError =
    (imageObjectKey &&
      imageName &&
      errors[imageObjectKey] &&
      errors[imageObjectKey][imageName]) ??
    "";

  return (
    <FormControl hidden={hidden} isInvalid={!!imageError}>
      <FormLabel fontSize={"md"} color={"gray.500"}>
        {label}
      </FormLabel>
      <HStack>
        <VStack
          px={6}
          py="5px"
          borderWidth={2}
          _dark={{
            color: "gray.500",
          }}
          h="100px"
          textAlign={"center"}
          borderStyle="dashed"
          rounded="md"
          transition="background-color 0.2s ease"
          _hover={{ bg: activeBg }}
          bg={isDragActive ? activeBg : "transparent"}
          {...getRootProps()}
        >
          <Flex color={"gray.400"}>
            {!uploading && "Arrastre una foto o busque entre sus archivos"}
            {uploading && (
              <span>
                Subiendo, un momento porfavor. <Spinner size="xl" />
              </span>
            )}
          </Flex>
          {!uploading && (
            <Icon h="50px" w="50px">
              <AiOutlineCloudUpload />
            </Icon>
          )}
          <VisuallyHidden>
            <input {...getInputProps()} />
          </VisuallyHidden>
        </VStack>

        <Image
          style={{ borderRadius: "8px" }}
          alt={"upload picture"}
          src={pictureUrl?.length ? pictureUrl : "/no-image.png"}
          width={100}
          height={100}
        />
      </HStack>

      {error && <FormErrorMessage>{error}</FormErrorMessage>}
      {!imageError.message ? (
        <FormHelperText color={"gray.500"}>{helperText}</FormHelperText>
      ) : (
        //@ts-ignore
        <FormErrorMessage>{imageError.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormControlledImageUpload;
