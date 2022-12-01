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
  Image,
  Textarea,
  HStack,
  Button,
} from '@chakra-ui/react';
import { isDragActive } from 'framer-motion';
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
import uploadFileToBlob from '../../lib/utils/azure-storage-blob';
import { compressCoverPhoto } from '../../lib/utils/ImageCompressor';

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  name: Path<T>;
  label: string;
  helperText?: string;
  hidden?: boolean;
  autoFocus?: boolean;
  setValue: SetFieldValue<T>;
}

const FormControlledText = <T extends FieldValues>(props: InputProps<T>) => {
  const {
    control,
    name,
    errors,
    label,
    helperText,
    hidden,
    autoFocus,
    setValue,
  } = props;
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
      <FormLabel fontSize={'md'} color={'gray.500'}>
        {label} {uploading && 'Subiendo, un momento porfavor.'}
      </FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <InputGroup flexDirection={'column'}>
            <FormLabel
              fontSize="sm"
              fontWeight="md"
              color="gray.700"
              _dark={{
                color: 'gray.50',
              }}
            >
              (Arrastre o haga click para editar.) Ratio: 4/1
            </FormLabel>
            {(!pictureUrl || fileSelected) && (
              <Flex
                mt={1}
                justify="center"
                px={6}
                pt={5}
                pb={6}
                borderWidth={2}
                _dark={{
                  color: 'gray.500',
                }}
                borderStyle="dashed"
                rounded="md"
                transition="background-color 0.2s ease"
                _hover={{ bg: activeBg }}
                bg={isDragActive ? activeBg : 'transparent'}
                {...getRootProps()}
              >
                <Stack spacing={1} textAlign="center">
                  <Icon
                    mx="auto"
                    boxSize={12}
                    color="gray.400"
                    _dark={{
                      color: 'gray.500',
                    }}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Icon>
                  <Flex
                    fontSize="sm"
                    color="gray.600"
                    _dark={{
                      color: 'gray.400',
                    }}
                    alignItems="baseline"
                  >
                    <chakra.label
                      htmlFor="file-upload"
                      cursor="pointer"
                      rounded="md"
                      fontSize="md"
                      color="brand.600"
                      _dark={{
                        color: 'brand.200',
                      }}
                      pos="relative"
                      _hover={{
                        color: 'brand.400',
                        _dark: {
                          color: 'brand.300',
                        },
                      }}
                    >
                      <span>Suba una foto o arrastre y suelte</span>
                      <VisuallyHidden>
                        <input {...getInputProps()} />
                      </VisuallyHidden>
                    </chakra.label>
                  </Flex>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    _dark={{
                      color: 'gray.50',
                    }}
                  >
                    PNG, JPG, GIF up to 10MB
                  </Text>
                </Stack>
              </Flex>
            )}
            {(fileSelected || pictureUrl) && (
              <AspectRatio
                transition="background-color 0.2s ease"
                _hover={{ opacity: '80%' }}
                style={isDragActive ? { opacity: '80%' } : {}}
                {...getRootProps()}
                ratio={4 / 1}
              >
                <Image
                  alt={'SelectedPicture'}
                  // src={coverPhotoUrl ?? undefined}
                  src={pictureUrl ?? localUrl ?? ''}
                  fit={'cover'}
                  w={'100%'}
                  h={{ base: '100%', sm: '300px', lg: '400px' }}
                />
              </AspectRatio>
            )}
          </InputGroup>
        )}
      />
      {!errors[name] ? (
        <FormHelperText color={'gray.500'}>{helperText}</FormHelperText>
      ) : (
        //@ts-ignore
        <FormErrorMessage>{errors[name].message}</FormErrorMessage>
      )}
      <HStack>
        <Button onClick={onFileUpload}>Subir Imágen</Button>
        <Button disabled={!pictureUrl} onClick={generateText}>
          Generar Texto
        </Button>
      </HStack>
      <Textarea
        mt={4}
        borderColor={'gray.300'}
        // value={field.value}
        // onChange={field.onChange}
        autoFocus={autoFocus}
      />
      <FormHelperText color={'gray.500'}>Texto autogenerado.</FormHelperText>
    </FormControl>
  );
};

export default FormControlledText;
