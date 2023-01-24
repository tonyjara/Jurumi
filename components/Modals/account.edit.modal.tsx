import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Role } from '@prisma/client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { knownErrors } from '@/lib/dictionaries/knownErrors';
import { trpcClient } from '@/lib/utils/trpcClient';
import type { FormAccount } from '@/lib/validations/account.validate';
import {
  defaultAccountData,
  validateAccount,
} from '@/lib/validations/account.validate';
import FormControlledSelect from '../FormControlled/FormControlledSelect';
import FormControlledText from '../FormControlled/FormControlledText';
import { handleUseMutationAlerts } from '../Toasts & Alerts/MyToast';

const EditAccountModal = ({
  isOpen,
  onClose,
  account,
}: {
  isOpen: boolean;
  onClose: () => void;

  account: FormAccount;
}) => {
  const context = trpcClient.useContext();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormAccount>({
    defaultValues: defaultAccountData,
    resolver: zodResolver(validateAccount),
  });

  useEffect(() => {
    if (isOpen) {
      reset(account);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleOnClose = () => {
    reset(defaultAccountData);
    onClose();
  };
  const { error, mutate, isLoading } = trpcClient.account.edit.useMutation(
    handleUseMutationAlerts({
      successText: 'El usuario ha sido editado!',
      callback: () => {
        context.account.invalidate();
        handleOnClose();
      },
    })
  );

  const submitFunc = async (data: FormAccount) => {
    mutate(data);
  };

  const roleOptions: { value: Role; label: string }[] = [
    { value: 'USER', label: 'Usuario' },
    { value: 'MODERATOR', label: 'Moderador' },
    { value: 'ADMIN', label: 'Admin' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar un usuario</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            <FormControlledText
              control={control}
              errors={errors}
              name="email"
              label="Correo electrónico"
              autoFocus={true}
            />
            <FormControlledText
              control={control}
              errors={errors}
              name="displayName"
              label="Nombre del usuario"
              autoFocus={true}
            />
            <FormControlledSelect
              control={control}
              errors={errors}
              name="role"
              label="Seleccione un rol"
              options={roleOptions ?? []}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={isLoading || isSubmitting}
              type="submit"
              colorScheme="blue"
              mr={3}
            >
              Editar
            </Button>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default EditAccountModal;
