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
import React from 'react';
import { useForm } from 'react-hook-form';
import { knownErrors } from '../../lib/dictionaries/knownErrors';
import { trpcClient } from '../../lib/utils/trpcClient';
import {
  defaultOrgData,
  validateOrgCreate,
} from '../../lib/validations/org.create.validate';
import FormControlledText from '../Form/FormControlledText';
import { handleUseMutationAlerts } from '../Toasts/MyToast';

const CreateOrgModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: any;
}) => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Organization>({
    defaultValues: defaultOrgData,
    resolver: zodResolver(validateOrgCreate),
  });

  const { error, mutate, isLoading } = trpcClient.org.create.useMutation(
    handleUseMutationAlerts({
      successText: 'Su organización ha sido creada! 🔥',
      callback: () => {
        onClose();
        reset();
        context.org.getMany.invalidate();
      },
    })
  );

  const submitFunc = async (data: Organization) => {
    mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit ?? submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear una organización</ModalHeader>
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

export default CreateOrgModal;
