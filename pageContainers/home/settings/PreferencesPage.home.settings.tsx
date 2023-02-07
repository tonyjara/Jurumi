import TitleComponent from '@/components/Text/TitleComponent';
import { handleUseMutationAlerts } from '@/components/Toasts & Alerts/MyToast';
import { trpcClient } from '@/lib/utils/trpcClient';
import type { FormAccountProfile } from '@/lib/validations/profileSettings.validate';
import {
  defaultAccountProfileData,
  validateAccountProfile,
} from '@/lib/validations/profileSettings.validate';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { knownErrors } from '@/lib/dictionaries/knownErrors';
import FormControlledSwitch from '@/components/FormControlled/FormControlledSwitch';

const PreferencesSettingsPage = () => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormAccountProfile>({
    defaultValues: defaultAccountProfileData,
    resolver: zodResolver(validateAccountProfile),
  });

  const { error, mutate, isLoading } =
    trpcClient.account.updateMyPreferences.useMutation(
      handleUseMutationAlerts({
        successText: 'Sus preferencias han sido actualizadas.',
        callback: () => {
          reset();
          context.invalidate();
        },
      })
    );

  const { data, isLoading: isLoadingPreferences } =
    trpcClient.account.getForProfileEdit.useQuery();

  useEffect(() => {
    if (!data) return;
    reset(data);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const submitFunc = async (data: FormAccountProfile) => {
    mutate(data);
  };

  return (
    <Box w={'100%'} maxW={'600px'}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <Flex gap={'10px'}>
          <TitleComponent title="Preferencias" />
          <Button
            isDisabled={isLoading || isSubmitting || isLoadingPreferences}
            type="submit"
            colorScheme="blue"
            mr={3}
          >
            Guardar
          </Button>
        </Flex>
        {error && <Text color="red.300">{knownErrors(error.message)}</Text>}

        <Text mt={'10px'} fontSize={'2xl'}>
          Notificaciones
        </Text>

        <FormControlledSwitch
          control={control}
          errors={errors}
          name="preferences.receiveEmailNotifications"
          label="Recibir notificaciones por correo:  No - Si"
        />
      </form>
    </Box>
  );
};

export default PreferencesSettingsPage;
