import FormControlledSwitch from '@/components/FormControlled/FormControlledSwitch';
import FormControlledText from '@/components/FormControlled/FormControlledText';
import { handleUseMutationAlerts } from '@/components/Toasts & Alerts/MyToast';
import { trpcClient } from '@/lib/utils/trpcClient';
import type { FormOrganization } from '@/lib/validations/org.validate';
import type { FormOrgNotificationSettings } from '@/lib/validations/orgNotificationsSettings.validate';
import {
  defaultOrgNotificationSettingsData,
  validateOrgNotificationSettings,
} from '@/lib/validations/orgNotificationsSettings.validate';
import {
  Text,
  Card,
  CardHeader,
  Stack,
  Flex,
  VStack,
  Button,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const OrgNotificationSettingPage = () => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormOrgNotificationSettings>({
    defaultValues: defaultOrgNotificationSettingsData,
    resolver: zodResolver(validateOrgNotificationSettings),
  });

  const { data: prefs } = trpcClient.preferences.getMyPreferences.useQuery();
  const { data: workspaceInfo } =
    trpcClient.notifications.getWorkSpace.useQuery();

  const { data: orgNotificationSettings } =
    trpcClient.notifications.getOrgNotificationSettings.useQuery(
      { orgId: prefs?.selectedOrganization },
      { enabled: !!prefs?.selectedOrganization, refetchOnWindowFocus: false }
    );
  useEffect(() => {
    if (orgNotificationSettings) {
      reset(orgNotificationSettings);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgNotificationSettings]);

  const { error, mutate, isLoading } =
    trpcClient.notifications.saveOrgNotificationSettings.useMutation(
      handleUseMutationAlerts({
        successText: 'La configuración ha sido guardada',
        callback: () => {
          context.notifications.invalidate();
        },
      })
    );
  const submitFunc = async (data: FormOrgNotificationSettings) => {
    if (!prefs?.selectedOrganization) return;
    data.orgId = prefs.selectedOrganization;

    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(submitFunc)} noValidate>
      <Stack spacing={5} maxW="600px">
        <Flex justifyContent={'space-between'} alignItems="center">
          <Text fontSize={'3xl'}>Notificaciones de la organización</Text>
          <Button isDisabled={isLoading || isSubmitting} type="submit" mr={3}>
            Guardar
          </Button>
        </Flex>
        <Text fontWeight={'bold'} fontSize={'xl'}>
          Workspace:{' '}
          {workspaceInfo ?? 'Hubo errores con la configuración de slack'}{' '}
        </Text>
        <VStack maxW={'300px'} spacing={5}>
          <FormControlledSwitch
            control={control}
            errors={errors}
            name="allowNotifications"
            label="Permitir notificaciones"
          />
          <FormControlledText
            control={control}
            errors={errors}
            name="approversSlackChannelId"
            label="Id de canal de slack para aprobadores"
            helperText="Recibir notificaciones sobre solicitudes pendientes."
          />

          <FormControlledText
            control={control}
            errors={errors}
            name="administratorsSlackChannelId"
            label="Id de canal de slack para administradores"
            helperText="Recibir notificaciones sobre solicitudes aprobadas"
          />
        </VStack>
      </Stack>
    </form>
  );
};

export default OrgNotificationSettingPage;
