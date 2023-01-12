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
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { knownErrors } from '../../lib/dictionaries/knownErrors';
import { trpcClient } from '../../lib/utils/trpcClient';
import { handleUseMutationAlerts } from '../Toasts/MyToast';
import SeedButton from '../DevTools/SeedButton';
import type { FormMoneyRequest } from '../../lib/validations/moneyRequest.validate';
import {
  defaultMoneyRequestData,
  validateMoneyRequest,
} from '../../lib/validations/moneyRequest.validate';
import MoneyRequestForm from '../Forms/MoneyRequest.form';
import { useSession } from 'next-auth/react';
import { moneyRequestMock } from '../../__tests__/mocks/Mocks';

const CreateMoneyRequestModal = ({
  isOpen,
  onClose,
  projectId,
  orgId,
}: {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  orgId: string | null;
}) => {
  const context = trpcClient.useContext();
  const { data: session } = useSession();
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormMoneyRequest>({
    defaultValues: defaultMoneyRequestData,
    resolver: zodResolver(validateMoneyRequest),
  });
  const handleOnClose = () => {
    reset(defaultMoneyRequestData);
    onClose();
  };

  useEffect(() => {
    if (orgId && isOpen) {
      setValue('organizationId', orgId);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, isOpen]);

  const { error, mutate, isLoading } =
    trpcClient.moneyRequest.create.useMutation(
      handleUseMutationAlerts({
        successText: 'Su solicitud ha sido creada!',
        callback: () => {
          handleOnClose();
          context.moneyRequest.invalidate();
        },
      })
    );

  const submitFunc = async (data: FormMoneyRequest) => {
    //Admins and moderators add projectId Manually
    const isUser = session?.user.role === 'USER';
    data.projectId = isUser && projectId ? projectId : data.projectId;
    mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear una solicitud de fondos</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SeedButton reset={reset} mock={moneyRequestMock} />
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            <MoneyRequestForm control={control} errors={errors as any} />
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
