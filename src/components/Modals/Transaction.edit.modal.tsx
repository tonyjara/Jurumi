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
import { projectMock } from '../../__tests__/mocks/Mocks';
import type { Transaction } from '@prisma/client';

import {
  defaultTransactionEditValues,
  validateTransactionEdit,
} from '../../lib/validations/transaction.edit.validate';
import TransactionEditForm from '../Forms/Transaction.edit.form';

const EditTransactionModal = ({
  isOpen,
  onClose,
  transaction,
}: {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
}) => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Transaction>({
    defaultValues: defaultTransactionEditValues,
    resolver: zodResolver(validateTransactionEdit),
  });
  useEffect(() => {
    if (isOpen) {
      reset(transaction);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  const handleOnClose = () => {
    reset(defaultTransactionEditValues);
    onClose();
  };

  const { error, mutate, isLoading } = trpcClient.transaction.edit.useMutation(
    handleUseMutationAlerts({
      successText: 'Su transacción ha sido editada! ',
      callback: () => {
        context.transaction.invalidate();
        context.moneyAcc.invalidate();
        handleOnClose();
      },
    })
  );

  const submitFunc = async (data: Transaction) => {
    mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar una transacción</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SeedButton reset={reset} mock={projectMock} />
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            <TransactionEditForm control={control} errors={errors} />
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

export default EditTransactionModal;
