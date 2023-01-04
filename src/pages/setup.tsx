import {
  Container,
  Stack,
  Heading,
  useColorModeValue,
  Box,
  Button,
  Text,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import FormControlledText from '../components/FormControlled/FormControlledText';
import { handleUseMutationAlerts } from '../components/Toasts/MyToast';
import { knownErrors } from '../lib/dictionaries/knownErrors';
import { trpcClient } from '../lib/utils/trpcClient';

import type { FormInitialSetup } from '../lib/validations/setup.validate';
import {
  defaultInitialSetupData,
  validateInitialSetup,
} from '../lib/validations/setup.validate';
import { getServerAuthSession } from '../server/common/get-server-auth-session';
//This page is only available when there are no users in the database
const Setup = () => {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInitialSetup>({
    defaultValues: defaultInitialSetupData,
    resolver: zodResolver(validateInitialSetup),
  });

  const { error, mutate, isLoading } =
    trpcClient.account.createOneUNSAFE.useMutation(
      handleUseMutationAlerts({
        successText: 'El usuario ha sido creado! Ingrese con su nuevo usuario',
        callback: () => {
          reset(defaultInitialSetupData);
          router.push('/');
        },
      })
    );

  const submitFunc = async (data: FormInitialSetup) => {
    mutate(data);
  };
  return (
    <Container>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <Stack spacing={2}>
          <Heading
            textAlign={'center'}
            py={{ base: 0, md: 5 }}
            fontSize={{ base: '2xl', md: '4xl' }}
          >
            Setup
          </Heading>

          <Box
            rounded={'lg'}
            bg={{
              base: '-moz-initial',
              md: useColorModeValue('white', 'gray.700'),
            }}
            boxShadow={{ base: 'none', md: 'lg' }}
            p={5}
            minW={{ base: 'full', md: 'lg' }}
            maxW="xl"
          >
            <Stack spacing={2}>
              {error && (
                <Text color="red.300">{knownErrors(error.message)}</Text>
              )}
              <FormControlledText
                label={'Nombre'}
                errors={errors}
                control={control}
                name="displayName"
              />
              <FormControlledText
                label={'Correo electrónico'}
                errors={errors}
                control={control}
                name="email"
                type="email"
                helperText={'Ej: mimail@mail.com'}
              />
              <FormControlledText
                label={'Contraseña'}
                errors={errors}
                control={control}
                name="password"
                type="password"
              />
              <FormControlledText
                label={'Confirmar contraseña'}
                errors={errors}
                control={control}
                name="confirmPassword"
                type="password"
              />

              <Stack spacing={5}>
                <Stack
                  spacing={5}
                  textAlign={'center'}
                  direction={{ base: 'column' }}
                >
                  <Button
                    disabled={isSubmitting || isLoading}
                    type="submit"
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }}
                  >
                    Crear
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </form>
    </Container>
  );
};

export default Setup;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  //Redirects if more than one account exists
  const accounts = await prisma?.account.findMany();

  const session = await getServerAuthSession(ctx);
  if (accounts?.length && !session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
      props: {},
    };
  }

  if (session) {
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};
