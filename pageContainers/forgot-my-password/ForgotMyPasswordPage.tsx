import React, { useState } from 'react';
import {
  Box,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  Container,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormControlledText from '@/components/FormControlled/FormControlledText';
import { trpcClient } from '@/lib/utils/trpcClient';
import { handleUseMutationAlerts } from '@/components/Toasts & Alerts/MyToast';

export default function ForgotMyPasswordPage() {
  const [disableButton, setDisableButton] = useState(false);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>({
    defaultValues: { email: '' },
    resolver: zodResolver(
      z.object({ email: z.string().email('Favor ingrese un correo válido.') })
    ),
  });

  const { mutate, isLoading } =
    trpcClient.magicLinks.createLinkForPasswordRecovery.useMutation(
      handleUseMutationAlerts({
        successText:
          'Se ha enviado un link para verificar su cuenta a su correo!',
        callback: async () => {
          reset();
        },
      })
    );

  const submitFunc = async ({ email }: { email: string }) => {
    mutate({ email });
    setDisableButton(true);
    setTimeout(() => {
      setDisableButton(false);
    }, 5000);
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
            Olvide mi contraseña
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
            <Stack spacing={5}>
              <FormControlledText
                label={'Correo electrónico'}
                errors={errors}
                control={control}
                name="email"
                type="email"
                helperText={'Ingrese un correo para recuperar su contraseña.'}
              />

              <Button
                isDisabled={isSubmitting || isLoading || disableButton}
                type="submit"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
              >
                Enviar
              </Button>
            </Stack>
          </Box>
        </Stack>
      </form>
    </Container>
  );
}
