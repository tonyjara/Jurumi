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
import React from 'react';
import { useForm } from 'react-hook-form';
import { knownErrors } from '@/lib/dictionaries/knownErrors';
import { trpcClient } from '@/lib/utils/trpcClient';
import type { accountWithVerifyLink } from '@/lib/validations/account.validate';
import {
  defaultAccountData,
  validateAccount,
} from '../../lib/validations/account.validate';

import { handleUseMutationAlerts } from '../Toasts & Alerts/MyToast';
import MemberForm from '../Forms/member.form';
import type { FormMember } from '@/lib/validations/member.validate';
import { mockFormMember } from '@/lib/validations/member.validate';
import {
  defaultMemberData,
  validateMember,
} from '@/lib/validations/member.validate';
import SeedButton from '../DevTools/SeedButton';

const CreateMemberModal = ({
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
  } = useForm<FormMember>({
    defaultValues: defaultMemberData,
    resolver: zodResolver(validateMember),
  });
  const handleOnClose = () => {
    setValue('');
    reset(defaultMemberData);
    onClose();
  };
  const { error, mutate, isLoading } = trpcClient.members.create.useMutation(
    handleUseMutationAlerts({
      successText: 'El asociado ha sido creado!',
      callback: () => {
        context.members.invalidate();

        handleOnClose();
      },
    })
  );

  const submitFunc = async (data: FormMember) => {
    mutate(data);
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(onSubmit ?? submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear un socio</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SeedButton reset={reset} mock={() => mockFormMember} />
            <Text color={'gray.400'}>
              Si el email ya existe como usuario, los datos del usuario serán
              priorizados.
            </Text>
            {value.length > 0 && (
              <Container textAlign={'center'}>
                <Text fontWeight={'bold'} fontSize={'xl'}>
                  Comparte el link con la persona que quieres invitar.
                </Text>
                <Button onClick={onCopy} mb={10} mt={1}>
                  {hasCopied ? 'Copiado!' : 'Copiar link de invitación'}
                </Button>
              </Container>
            )}
            {!value.length && (
              <>
                {error && (
                  <Text color="red.300">{knownErrors(error.message)}</Text>
                )}
                <MemberForm
                  control={control}
                  errors={errors}
                  setValue={setValue}
                />
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={isLoading || isSubmitting || !!value}
              type="submit"
              colorScheme="blue"
              mr={3}
            >
              Guardar
            </Button>
            <Button colorScheme="gray" mr={3} onClick={handleOnClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default CreateMemberModal;
