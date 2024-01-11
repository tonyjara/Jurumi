import {
  FormControl,
  VisuallyHidden,
  useColorModeValue,
  FormLabel,
  Spinner,
  Avatar,
  Box,
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
import uploadFileToBlob from "../../lib/utils/azure-storage-blob";
import { compressCoverPhoto } from "../../lib/utils/ImageCompressor";
import { myToast } from "../Toasts & Alerts/MyToast";
import axios from "axios";
interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: any;
  urlName: Path<T>; // the url returned from azure
  label: string;
  hidden?: boolean;
  setValue: SetFieldValue<T>;
  helperText?: string;
  userId: string;
}

const FormControlledAvatarUpload = <T extends FieldValues>(
  props: InputProps<T>,
) => {
  const { control, urlName, label, hidden, setValue, userId } = props;
  const [uploading, setUploading] = useState(false);
  const pictureUrl = useWatch({ control, name: urlName }) as string;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleImageUpload(acceptedFiles);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageUpload = async (files: File[]) => {
    try {
      if (!files[0]) return;
      setUploading(true);

      const getFile: File = files[0];
      //This way avatarurl is always the same
      const file = new File([getFile], "avatarUrl", {
        type: getFile.type,
        lastModified: getFile.lastModified,
      });
      const compressed = await compressCoverPhoto(file);

      const req = await axios("/api/get-connection-string");
      const { connectionString } = req.data;

      const url = await uploadFileToBlob(compressed, userId, connectionString);

      setValue(urlName, url);

      setUploading(false);
    } catch (err) {
      myToast.error();
      console.error(err);
      setUploading(false);
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

  return (
    <FormControl px={6} py="5px" hidden={hidden}>
      <FormLabel
        fontSize={"md"}
        color={"gray.600"}
        _dark={{ color: "gray.400" }}
      >
        {label}
      </FormLabel>

      <Box cursor={"pointer"} {...getRootProps()}>
        <Avatar
          src={pictureUrl?.length ? pictureUrl : undefined}
          width={100}
          height={100}
          _hover={{ bg: activeBg }}
          bg={isDragActive ? activeBg : "teal"}
        />
      </Box>
      {uploading && (
        <span>
          Subiendo, un momento porfavor. <Spinner size="xl" />
        </span>
      )}

      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
    </FormControl>
  );
};

export default FormControlledAvatarUpload;
