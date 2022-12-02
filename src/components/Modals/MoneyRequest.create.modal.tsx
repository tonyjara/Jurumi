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
import type { MoneyRequest } from '@prisma/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { knownErrors } from '../../lib/dictionaries/knownErrors';
import { trpcClient } from '../../lib/utils/trpcClient';
import { handleUseMutationAlerts } from '../Toasts/MyToast';
import SeedButton from '../DevTools/SeedButton';
import {
  defaultDisbursementValues,
  validateMoneyRequest,
} from '../../lib/validations/moneyRequest.validate';
import DisbursementForm from '../Forms/MoneyRequest.form';
import { useSession } from 'next-auth/react';
import { moneyRequestMock } from '../../__tests__/mocks/Mocks';

const CreateMoneyRequestModal = ({
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
  } = useForm<MoneyRequest>({
    defaultValues: defaultDisbursementValues,
    resolver: zodResolver(validateMoneyRequest),
  });
  const handleOnClose = () => {
    reset(defaultDisbursementValues);
    onClose();
  };

  const { error, mutate, isLoading } =
    trpcClient.moneyRequest.create.useMutation(
      handleUseMutationAlerts({
        successText: 'Su solicitud ha sido creado!',
        callback: () => {
          handleOnClose();
          context.moneyRequest.getMany.invalidate();
        },
      })
    );

  const submitFunc = async (data: MoneyRequest) => {
    console.log(data);

    //Admins and moderators add projectId Manually
    // const isUser = session?.user.role === 'USER';
    // data.projectId = isUser ? projectId : data.projectId;

    // mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear una solicitud desembolso</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SeedButton reset={reset} mock={moneyRequestMock} />
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

export default CreateMoneyRequestModal;
