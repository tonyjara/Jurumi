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
import type { BankAccount } from '@prisma/client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { knownErrors } from '../../lib/dictionaries/knownErrors';

import { trpcClient } from '../../lib/utils/trpcClient';
import {
  defaultBankAccountValues,
  validateBankAccountCreate,
} from '../../lib/validations/bankAcc.validate';
import { handleUseMutationAlerts } from '../Toasts/MyToast';
import { DevTool } from '@hookform/devtools';
import SeedButton from '../DevTools/SeedButton';
import { bankAccMock } from '../../__tests__/mocks/Mocks';
import BankAccForm from '../Forms/BankAcc.form';

const EditBankAccModal = ({
  isOpen,
  onClose,
  bankData,
}: {
  bankData: BankAccount;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BankAccount>({
    defaultValues: defaultBankAccountValues,
    resolver: zodResolver(validateBankAccountCreate),
  });
  const handleOnClose = () => {
    reset(defaultBankAccountValues);
    onClose();
  };
  useEffect(() => {
    if (isOpen) {
      reset(bankData);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const { error, mutate, isLoading } = trpcClient.bankAcc.edit.useMutation(
    handleUseMutationAlerts({
      successText: 'Su cuenta ha sido editada!',
      callback: () => {
        handleOnClose();
        context.bankAcc.getMany.invalidate();
      },
    })
  );

  const submitFunc = async (data: BankAccount) => {
    mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar una cuenta bancaria</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SeedButton reset={reset} mock={bankAccMock} />
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            <BankAccForm control={control} errors={errors} />
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
      <DevTool control={control} />
    </Modal>
  );
};

export default EditBankAccModal;
