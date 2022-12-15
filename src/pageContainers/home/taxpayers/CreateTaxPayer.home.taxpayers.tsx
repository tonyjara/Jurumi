import {
  Button,
  Text,
  Heading,
  HStack,
  Divider,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import type { TaxPayer } from '@prisma/client';
import { useRouter } from 'next/router';
import {
  defaultTaxPayer,
  taxPayerValidate,
} from '../../../lib/validations/taxtPayer.validate';
import { trpcClient } from '../../../lib/utils/trpcClient';
import { handleUseMutationAlerts } from '../../../components/Toasts/MyToast';
import FormContainer from '../../../components/Containers/FormContainer';
import { knownErrors } from '../../../lib/dictionaries/knownErrors';
import FormControlledText from '../../../components/FormControlled/FormControlledText';

const CreateTaxPayerPage = () => {
  const context = trpcClient.useContext();
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaxPayer>({
    defaultValues: defaultTaxPayer,
    resolver: zodResolver(taxPayerValidate),
  });

  const { error, mutate, isLoading } = trpcClient.taxPayer.create.useMutation(
    handleUseMutationAlerts({
      successText: 'El contribuyente ha sido creado.',
      callback: () => {
        context.taxPayer.invalidate();
        reset(defaultTaxPayer);
        // handleGoBack();
      },
    })
  );

  const submitFunc = async (data: TaxPayer) => {
    mutate(data);
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <Heading fontSize={'2xl'}>Crear contribuyente</Heading>

        {error && <Text color="red.300">{knownErrors(error.message)}</Text>}

        <Divider my={'20px'} />

        <VStack spacing={5}>
          <FormControlledText
            control={control}
            errors={errors}
            name="razonSocial"
            label="Razón social"
          />
          <FormControlledText
            control={control}
            errors={errors}
            name="ruc"
            label="R.U.C."
          />
          <FormControlledText
            control={control}
            errors={errors}
            name="fantasyName"
            label="Nombre de fantasía (opcional)"
          />
        </VStack>

        <Text mt={'10px'} color={'red.400'}>
          {errors.id && errors.id.message}
        </Text>

        <HStack mt={'10px'} justifyContent="end">
          <Button colorScheme="gray" mr={3} onClick={handleGoBack}>
            Volver
          </Button>
          <Button
            disabled={isLoading || isSubmitting}
            type="submit"
            colorScheme="blue"
            mr={3}
          >
            Guardar
          </Button>
        </HStack>
      </form>
    </FormContainer>
  );
};

export default CreateTaxPayerPage;
