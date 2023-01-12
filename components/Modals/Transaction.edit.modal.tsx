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

import type { FormTransactionEdit } from '../../lib/validations/transaction.edit.validate';
import {
  defaultTransactionEditValues,
  validateTransactionEdit,
} from '../../lib/validations/transaction.edit.validate';
import TransactionEditForm from '../Forms/Transaction.edit.form';
import type { Transaction } from '@prisma/client';

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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormTransactionEdit>({
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
  const { data: isLastTransaction } =
    trpcClient.transaction.isLastTransaction.useQuery({
      moneyAccountId: transaction.moneyAccountId,
      transactionId: transaction.id,
    });

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

  const submitFunc = async (data: FormTransactionEdit) => {
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
            {!isLastTransaction && (
              <Text fontSize={'sm'} color={'red.500'}>
                Algunos campos no pueden editarse, en caso que necesite
                modificarlos favor anular la transacción y crear una nueva.
              </Text>
            )}
            <SeedButton reset={reset} mock={projectMock} />
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            <TransactionEditForm
              setValue={setValue}
              control={control}
              errors={errors}
              isEditable={!!isLastTransaction}
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

export default EditTransactionModal;
