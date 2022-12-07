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
import { handleUseMutationAlerts } from '../Toasts/MyToast';
import SeedButton from '../DevTools/SeedButton';

import { useSession } from 'next-auth/react';
import { transactionMock } from '../../__tests__/mocks/Mocks';
import type { MoneyRequest, Transaction } from '@prisma/client';
import TransactionForm from '../Forms/Transaction.form';
import {
  defaultTransactionValues,
  validateTransaction,
} from '../../lib/validations/transaction.validate';

const CreateMoneyRequestModal = ({
  isOpen,
  onClose,
  moneyRequest,
}: {
  isOpen: boolean;
  onClose: () => void;
  moneyRequest?: MoneyRequest;
}) => {
  const context = trpcClient.useContext();
  const { data: session } = useSession();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Transaction>({
    defaultValues: defaultTransactionValues,
    resolver: zodResolver(validateTransaction),
  });
  const handleOnClose = () => {
    //   reset(defaultMoneyRequestValues);
    onClose();
  };

  const { error, mutate, isLoading } =
    trpcClient.moneyRequest.create.useMutation(
      handleUseMutationAlerts({
        successText: 'Su solicitud ha sido creada!',
        callback: () => {
          handleOnClose();
          context.moneyRequest.getMany.invalidate();
          context.moneyRequest.getManyWithAccounts.invalidate();
        },
      })
    );

  const submitFunc = async (data: Transaction) => {
    console.log(data);

    //   mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear una solicitud desembolso</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SeedButton reset={reset} mock={transactionMock} />
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            <TransactionForm control={control} errors={errors} />
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
