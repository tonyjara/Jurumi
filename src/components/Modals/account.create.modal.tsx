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
  useClipboard,
  Container,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Account, Role } from '@prisma/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { knownErrors } from '../../lib/dictionaries/knownErrors';
import { trpcClient } from '../../lib/utils/trpcClient';
import type { accountWithVerifyLink } from '../../lib/validations/account.validate';
import {
  defaultAccData,
  validateAccount,
} from '../../lib/validations/account.validate';

import FormControlledSelect from '../FormControlled/FormControlledSelect';
import FormControlledText from '../FormControlled/FormControlledText';
import { handleUseMutationAlerts } from '../Toasts/MyToast';

const CreateAccountModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: any;
}) => {
  const context = trpcClient.useContext();
  const { onCopy, value, setValue, hasCopied } = useClipboard('');

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Account>({
    defaultValues: defaultAccData,
    resolver: zodResolver(validateAccount),
  });
  const handleOnClose = () => {
    reset(defaultAccData);
    setValue('');
    onClose();
  };
  const { error, mutate, isLoading } = trpcClient.account.create.useMutation(
    handleUseMutationAlerts({
      successText: 'El usuario ha sido creado!',
      callback: (returnedData: accountWithVerifyLink) => {
        console.log(returnedData);
        const verifyLink =
          returnedData.accountVerificationLinks[0]?.verificationLink;
        if (!verifyLink) return;
        setValue(verifyLink);
        // handleOnClose();
        reset(defaultAccData);
        context.account.getVerificationLinks.invalidate();
      },
    })
  );

  const submitFunc = async (data: Account) => {
    mutate(data);
  };

  const roleOptions: { value: Role; label: string }[] = [
    { value: 'USER', label: 'Usuario' },
    { value: 'MODERATOR', label: 'Moderador' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(onSubmit ?? submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear un usuario</ModalHeader>
          <ModalCloseButton />
          {value && (
            <Container textAlign={'center'}>
              <Text fontWeight={'bold'} fontSize={'xl'}>
                Comparte el link con la persona que quieres invitar.
              </Text>
              <Button onClick={onCopy} mb={10} mt={1}>
                {hasCopied ? 'Copiado!' : 'Copiar link de invitación'}
              </Button>
            </Container>
          )}
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
              disabled={isLoading || isSubmitting || !!value}
              type="submit"
              colorScheme="blue"
              mr={3}
            >
              Guardar
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

export default CreateAccountModal;
