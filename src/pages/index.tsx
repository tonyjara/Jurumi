import React, { useEffect } from 'react';
import {
  Box,
  Stack,
  Button,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import FormControlledText from '../components/FormControlled/FormControlledText';
import type { signinData } from '../lib/validations/auth.signin.validate';
import {
  defaultSigninData,
  signinValidation,
} from '../lib/validations/auth.signin.validate';
import { signIn, useSession } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import type { GetServerSideProps } from 'next';
import { getServerAuthSession } from '../server/common/get-server-auth-session';

export default function Signin({ onSubmit }: { onSubmit?: any }) {
  const router = useRouter();
  const { t } = useTranslation(['signin', 'common', 'validation', 'forms']);

  // const { status } = useSession();

  // useEffect(() => {
  //   if (status === 'authenticated') {
  //     router.push('/home');
  //   }
  //   return () => {};
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [status]);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<signinData>({
    defaultValues: defaultSigninData,
    resolver: zodResolver(signinValidation(t)),
  });

  const submitSigning = async ({ email, password }: signinData) => {
    const x = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (!x?.error) {
      //redirect
      router.push('/home');
    }

    if (x?.error) {
      //handle
      console.log(x.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit ?? submitSigning)} noValidate>
      {/* <TopNavbar /> */}
      <Stack spacing={2} py={{ base: 5, md: 10 }}>
        <Heading
          textAlign={'center'}
          py={{ base: 0, md: 5 }}
          fontSize={{ base: '2xl', md: '4xl' }}
        >
          {t('signin:heading')}
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
          <Stack spacing={2}>
            <FormControlledText
              label={t('forms:email')}
              errors={errors}
              control={control}
              name="email"
              type="email"
              helperText={t('forms:emailHelper')}
              data-testid="forms:email"
            />
            <FormControlledText
              label={t('forms:password')}
              errors={errors}
              control={control}
              name="password"
              type="password"
              data-testid="forms:password"
            />

            <Stack spacing={5}>
              <Stack
                spacing={5}
                textAlign={'center'}
                direction={{ base: 'column' }}
              >
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                >
                  {t('common:buttons.save')}
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
  const { p = '/' } = ctx.query;

  const session = await getServerAuthSession(ctx);

  const destination = () => {
    if (p.toString().length === 1) return '/home';
    return p.toString();
  };

  if (session) {
    return {
      redirect: {
        destination: destination(),
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale ?? 'es', [
        'signin',
        'common',
        'validation',
        'forms',
      ])),
      // Will be passed to the page component as props
    },
  };
};
