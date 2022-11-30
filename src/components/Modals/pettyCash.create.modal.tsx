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
import type { PettyCash } from '@prisma/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { knownErrors } from '../../lib/dictionaries/knownErrors';

import { trpcClient } from '../../lib/utils/trpcClient';
import { handleUseMutationAlerts } from '../Toasts/MyToast';
import { DevTool } from '@hookform/devtools';
import SeedButton from '../DevTools/SeedButton';
import { pettyCashMock } from '../../__tests__/mocks/Mocks';
import PettyCashForm from '../Forms/PettyCash.form';
import {
  defaultPettyCashValues,
  validatePettyCash,
} from '../../lib/validations/pettyCash.validate';

const CreatePettyCashModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PettyCash>({
    defaultValues: defaultPettyCashValues,
    resolver: zodResolver(validatePettyCash),
  });
  const handleOnClose = () => {
    reset(defaultPettyCashValues);
    onClose();
  };

  const { error, mutate, isLoading } = trpcClient.pettyCash.create.useMutation(
    handleUseMutationAlerts({
      successText: 'Su caja chica ha sido creada! 🔥',
      callback: () => {
        handleOnClose();
        context.pettyCash.getMany.invalidate();
      },
    })
  );

  const submitFunc = async (data: PettyCash) => {
    mutate(data);
    console.log(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear una caja chica</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SeedButton reset={reset} mock={pettyCashMock} />
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            <PettyCashForm control={control} errors={errors} />
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
      <DevTool control={control} />
    </Modal>
  );
};

export default CreatePettyCashModal;
