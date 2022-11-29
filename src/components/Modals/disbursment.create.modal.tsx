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
import type { Disbursement } from '@prisma/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { knownErrors } from '../../lib/dictionaries/knownErrors';
import { trpcClient } from '../../lib/utils/trpcClient';
import { handleUseMutationAlerts } from '../Toasts/MyToast';
import SeedButton from '../DevTools/SeedButton';
import { disbursmentMock } from '../../__tests__/mocks/Mocks';
import {
  defaultDisbursmentValues,
  validateDisbursment,
} from '../../lib/validations/disbursment.validate';
import DisbursmentForm from '../Forms/Disbursment.form';

const CreateDisbursmentModal = ({
  isOpen,
  onClose,
  projectId,
}: {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}) => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Disbursement>({
    defaultValues: defaultDisbursmentValues,
    resolver: zodResolver(validateDisbursment),
  });
  const handleOnClose = () => {
    reset(defaultDisbursmentValues);
    onClose();
  };

  const { error, mutate, isLoading } =
    trpcClient.disbursment.create.useMutation(
      handleUseMutationAlerts({
        successText: 'Su desembolso ha sido creado!',
        callback: () => {
          handleOnClose();
          context.disbursment.getMany.invalidate();
        },
      })
    );

  const submitFunc = async (data: Disbursement) => {
    data.projectId = projectId;

    mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear un desembolso</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SeedButton reset={reset} mock={disbursmentMock} />
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            <DisbursmentForm control={control} errors={errors} />
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

export default CreateDisbursmentModal;
