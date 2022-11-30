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
import { disbursementMock } from '../../__tests__/mocks/Mocks';
import {
  defaultDisbursementValues,
  validateDisbursement,
} from '../../lib/validations/disbursement.validate';
import DisbursementForm from '../Forms/Disbursement.form';
import { useSession } from 'next-auth/react';

const CreateDisbursementModal = ({
  isOpen,
  onClose,
  projectId,
}: {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}) => {
  const context = trpcClient.useContext();
  const { data: session } = useSession();
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Disbursement>({
    defaultValues: defaultDisbursementValues,
    resolver: zodResolver(validateDisbursement),
  });
  const handleOnClose = () => {
    reset(defaultDisbursementValues);
    onClose();
  };

  const { error, mutate, isLoading } =
    trpcClient.disbursement.create.useMutation(
      handleUseMutationAlerts({
        successText: 'Su desembolso ha sido creado!',
        callback: () => {
          handleOnClose();
          context.disbursement.getMany.invalidate();
        },
      })
    );

  const submitFunc = async (data: Disbursement) => {
    //Admins and moderators add projectId Manually
    const isUser = session?.user.role === 'USER';
    data.projectId = isUser ? projectId : data.projectId;

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
            <SeedButton reset={reset} mock={disbursementMock} />
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            <DisbursementForm
              setValue={setValue}
              control={control}
              errors={errors}
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

export default CreateDisbursementModal;
