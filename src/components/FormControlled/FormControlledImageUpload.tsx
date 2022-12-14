import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Text,
  AspectRatio,
  chakra,
  Flex,
  Icon,
  Stack,
  VisuallyHidden,
  useColorModeValue,
  Textarea,
  HStack,
  Button,
  VStack,
  Box,
} from '@chakra-ui/react';
import { isDragActive } from 'framer-motion';
import Image from 'next/image';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import type {
  Control,
  FieldErrorsImpl,
  FieldValues,
  Path,
  SetFieldValue,
} from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import uploadFileToBlob from '../../lib/utils/azure-storage-blob';
import { compressCoverPhoto } from '../../lib/utils/ImageCompressor';
interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  name: Path<T>;
  label: string;
  hidden?: boolean;
  setValue: SetFieldValue<T>;
  helperText?: string;
}

const FormControlledImageUpload = <T extends FieldValues>(
  props: InputProps<T>
) => {
  const { control, name, errors, label, hidden, setValue, helperText } = props;
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [localUrl, setLocalUrl] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState(Math.random().toString(36));
  const [uploading, setUploading] = useState(false);

  const ocrKey = process.env.NEXT_PUBLIC_OCR_KEY;

  const pictureUrl = useWatch({ control, name });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleImageUpload(acceptedFiles);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageUpload = async (files: File[]) => {
    try {
      if (!files[0]) return;

      const file: File = files[0];
      const compressed = await compressCoverPhoto(file);
      const fileName = `coverPhoto`;
      setFileSelected(file);
      const url = URL.createObjectURL(file);
      setLocalUrl(url);

      // const { url } = await fetchS3Url(fileName, file.type);

      // await fetch(url, {
      //   method: 'PUT',
      //   body: compressed,
      // });

      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        // setValue('coverPhotoUrl', reader.result);
        // setFileSelected(reader.result);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.log(err);
    }
  };

  const onFileUpload = async () => {
    // prepare UI
    setUploading(true);

    // *** UPLOAD TO AZURE STORAGE ***
    const url = await uploadFileToBlob(fileSelected);

    // prepare UI for results
    // setBlobList(blobsInContainer);
    console.log(url);
    setValue(name, url);

    // reset state/form
    setFileSelected(null);
    setUploading(false);
    setInputKey(Math.random().toString(36));
  };

  const generateText = async () => {
    if (!ocrKey) return;
    setUploading(true);
    const formData = new FormData();
    const myHeaders = new Headers();
    myHeaders.append('x-api-key', ocrKey);
    formData.append('image', pictureUrl);
    const req = await fetch('https://docs.opades.org.py/api/ocr/upload', {
      method: 'POST',
      body: formData,
      headers: myHeaders,
    });
    const res = await req.json();
    console.log(res);
    setUploading(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: {
      'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
    },
  });
  const activeBg = useColorModeValue('gray.100', 'gray.600');
  return (
    <FormControl hidden={hidden} isInvalid={!!errors[name]}>
      <HStack>
        <VStack
          px={6}
          py="5px"
          borderWidth={2}
          _dark={{
            color: 'gray.500',
          }}
          h="100px"
          textAlign={'center'}
          borderStyle="dashed"
          rounded="md"
          transition="background-color 0.2s ease"
          _hover={{ bg: activeBg }}
          bg={isDragActive ? activeBg : 'transparent'}
          {...getRootProps()}
        >
          <Text color={'gray.400'}>
            {!uploading && 'Arrastre una foto o busque entre sus archivos'}
            {uploading && 'Subiendo, un momento porfavor.'}
          </Text>
          <Icon h="50px" w="50px">
            <AiOutlineCloudUpload />
          </Icon>
          <VisuallyHidden>
            <input {...getInputProps()} />
          </VisuallyHidden>
        </VStack>

        {/* {(fileSelected || pictureUrl) && ( */}
        {/* <AspectRatio
        transition="background-color 0.2s ease"
        _hover={{ opacity: '80%' }}
        style={isDragActive ? { opacity: '80%' } : {}}
        {...getRootProps()}
        ratio={4 / 1}
      > */}

        <Image
          style={{ borderRadius: '8px' }}
          alt={'upload picture'}
          // src={coverPhotoUrl ?? undefined}
          src={pictureUrl.length ? pictureUrl : '/no-image.jpg'}
          width={135}
          height={150}
        />
      </HStack>
      {/* </AspectRatio> */}

      {!errors[name] ? (
        <FormHelperText color={'gray.500'}>{helperText}</FormHelperText>
      ) : (
        //@ts-ignore
        <FormErrorMessage>{errors[name].message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormControlledImageUpload;
