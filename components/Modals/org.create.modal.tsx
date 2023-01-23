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
import React from 'react';
import { useForm } from 'react-hook-form';
import { knownErrors } from '../../lib/dictionaries/knownErrors';
import { trpcClient } from '../../lib/utils/trpcClient';
import type { FormOrganization } from '../../lib/validations/org.validate';
import {
  defaultOrgData,
  validateOrganization,
} from '../../lib/validations/org.validate';
import OrgForm from '../Forms/Org.form';
import { handleUseMutationAlerts } from '../Toasts & Alerts/MyToast';

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
  } = useForm<FormOrganization>({
    defaultValues: defaultOrgData,
    resolver: zodResolver(validateOrganization),
  });
  const handleOnClose = () => {
    reset(defaultOrgData);
    onClose();
  };
  const { error, mutate, isLoading } = trpcClient.org.create.useMutation(
    handleUseMutationAlerts({
      successText: 'Su organización ha sido creada! 🔥',
      callback: () => {
        handleOnClose();
        reset();
        context.org.invalidate();
      },
    })
  );

  const submitFunc = async (data: FormOrganization) => {
    mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(onSubmit ?? submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear una organización</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}

            <OrgForm control={control} errors={errors as any} />
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
