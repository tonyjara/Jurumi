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
import type { Organization } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { knownErrors } from '../../lib/dictionaries/knownErrors';
import { trpcClient } from '../../lib/utils/trpcClient';
import { validateOrgEdit } from '../../lib/validations/org.edit.validate';
import FormControlledText from '../Form/FormControlledText';
import { handleUseMutationAlerts } from '../Toasts/MyToast';

const EditOrgModal = ({
  isOpen,
  onClose,
  id,
  displayName,
}: {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  displayName: string;
}) => {
  const { data: session } = useSession();
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Organization>({
    defaultValues: { id: '', displayName: '' },
    resolver: zodResolver(validateOrgEdit),
  });

  useEffect(() => {
    if (isOpen) {
      reset({ id, displayName });
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const { error, mutate, isLoading } = trpcClient.org.edit.useMutation(
    handleUseMutationAlerts({
      successText: 'Su organización ha sido editada! ✏️',
      callback: () => {
        onClose();
        reset();
        context.org.getMany.invalidate();
      },
    })
  );

  const submitFunc = async (data: Organization) => {
    const user = session?.user;
    if (!user) return;
    data.updatedById = user.id;
    mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar una organización</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}

            <FormControlledText
              control={control}
              errors={errors}
              name="displayName"
              label="Nombre de su organización"
              autoFocus={true}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              disabled={isLoading || isSubmitting}
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

export default EditOrgModal;
