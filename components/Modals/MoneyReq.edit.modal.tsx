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
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { knownErrors } from '../../lib/dictionaries/knownErrors';
import { trpcClient } from '../../lib/utils/trpcClient';
import { handleUseMutationAlerts } from '../Toasts & Alerts/MyToast';
import SeedButton from '../DevTools/SeedButton';
import type { FormMoneyRequest } from '../../lib/validations/moneyRequest.validate';
import { moneyRequestMock } from '../../lib/validations/moneyRequest.validate';
import {
  defaultMoneyRequestData,
  validateMoneyRequest,
} from '@/lib/validations/moneyRequest.validate';
import MoneyRequestForm from '../Forms/MoneyRequest.form';
import { useRouter } from 'next/router';

const EditMoneyRequestModal = ({
  isOpen,
  onClose,
  moneyRequest,
}: {
  isOpen: boolean;
  onClose: () => void;
  moneyRequest: MoneyRequest;
}) => {
  const router = useRouter();
  const context = trpcClient.useContext();
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
  useEffect(() => {
    if (isOpen) {
      reset(moneyRequest);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  const handleOnClose = () => {
    reset(defaultMoneyRequestData);
    onClose();
  };

  const { error, mutate, isLoading } = trpcClient.moneyRequest.edit.useMutation(
    handleUseMutationAlerts({
      successText: 'Su solicitud ha sido editada!',
      callback: () => {
        handleOnClose();
        context.moneyRequest.invalidate();
      },
    })
  );

  const submitFunc = async (data: FormMoneyRequest) => {
    //  if it was rejected and edited, it automaticly gets reseted to pending
    const route = router.asPath;
    if (moneyRequest.status === 'REJECTED' && route === '/home/requests') {
      data.status = 'PENDING';
    }

    mutate(data);
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar una solicitud desembolso</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SeedButton
              reset={reset}
              mock={() =>
                moneyRequestMock({
                  organizationId: '',
                  moneyRequestType: 'FUND_REQUEST',
                })
              }
            />
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            <MoneyRequestForm
              isEdit={true}
              setValue={setValue}
              control={control}
              errors={errors as any}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={isLoading || isSubmitting}
              type="submit"
              colorScheme="blue"
              mr={3}
            >
              Editar
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

export default EditMoneyRequestModal;
