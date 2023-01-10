import React from 'react';
import {
  Box,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import FormControlledText from '../../components/FormControlled/FormControlledText';

import {
  handleUseMutationAlerts,
  myToast,
} from '../../components/Toasts/MyToast';
import type { GetServerSideProps } from 'next';
import { verifyToken } from '../../lib/utils/asyncJWT';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FormNewUser } from '../../lib/validations/newUser.validate';
import {
  defaultNewUserData,
  validateNewUser,
} from '../../lib/validations/newUser.validate';
import { trpcClient } from '../../lib/utils/trpcClient';
import { knownErrors } from '../../lib/dictionaries/knownErrors';

export default function NewUser(props?: {
  token: string;
  data?: { email: string; displayName: string; linkId: string };
}) {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormNewUser>({
    resolver: zodResolver(validateNewUser),
    defaultValues: defaultNewUserData,
  });
  const { error, mutate, isLoading } =
    trpcClient.verificationLinks.assignPassword.useMutation(
      handleUseMutationAlerts({
        successText: 'Has creado tu cuenta!',
        callback: async () => {
          router.push('/home');
        },
      })
    );
  const submitForm = async (data: FormNewUser) => {
    const token = props?.token;
    const email = props?.data?.email;
    const linkId = props?.data?.linkId;
    if (!token || !email || !linkId) {
      return myToast.error();
    }
    data.token = token;
    data.email = email;
    data.linkId = linkId;

    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} noValidate>
      <Stack spacing={2} py={{ base: 5, md: 10 }}>
        <Heading
          textAlign={'center'}
          py={{ base: 0, md: 5 }}
          fontSize={{ base: '2xl', md: '4xl' }}
        >
          Confirmación de cuenta: {props?.data?.email}
        </Heading>
        <Heading
          py={{ base: 0, md: 5 }}
          alignSelf={'center'}
          size={'sm'}
          maxW="400px"
        >
          Hola {props?.data?.displayName}, has sido invitado/a a formar parte de
          esta organización, favor ingrese una contraseña para su cuenta nueva.
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
          alignSelf={'center'}
        >
          {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
          <Stack spacing={2}>
            <FormControlledText
              label={'Contraseña'}
              errors={errors}
              control={control}
              name="password"
              type="password"
            />
            <FormControlledText
              label={'Confirme su contraseña'}
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
                  disabled={isLoading || isSubmitting}
                  type="submit"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                >
                  Guardar
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </form>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = ctx.query.link as string | null;
  const secret = process.env.JWT_SECRET;
  if (!secret || !token) {
    return { notFound: true };
  }

  const verify = (await verifyToken(token, secret).catch((err) => {
    console.error('Verify err: ' + JSON.stringify(err));
  })) as {
    data: { email: string; displayName: string; linkId: string };
  } | null;

  if (verify && 'data' in verify) {
    const verifyLink = await prisma?.accountVerificationLinks.findUnique({
      where: { id: verify.data.linkId },
    });
    if (verifyLink?.hasBeenUsed) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        data: verify.data,
        token,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};
