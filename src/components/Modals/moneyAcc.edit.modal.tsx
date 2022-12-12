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
import { useForm, useWatch } from 'react-hook-form';
import { knownErrors } from '../../lib/dictionaries/knownErrors';

import { trpcClient } from '../../lib/utils/trpcClient';
import type { MoneyAccWithBankInfo } from '../../lib/validations/moneyAcc.validate';
import {
  defaultMoneyAccValues,
  validateMoneyAccount,
} from '../../lib/validations/moneyAcc.validate';
import { handleUseMutationAlerts } from '../Toasts/MyToast';
import SeedButton from '../DevTools/SeedButton';
import { moneyAccMock } from '../../__tests__/mocks/Mocks';
import EditMoneyAccForm from '../Forms/MoneyAcc.edit.form';
import type { MoneyAccount } from '@prisma/client';

const EditMoneyAccModal = ({
  isOpen,
  onClose,
  accData,
}: {
  accData: MoneyAccWithBankInfo | MoneyAccount;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MoneyAccWithBankInfo>({
    defaultValues: defaultMoneyAccValues,
    resolver: zodResolver(validateMoneyAccount),
  });
  const handleOnClose = () => {
    reset(defaultMoneyAccValues);
    onClose();
  };
  useEffect(() => {
    if (isOpen) {
      reset(accData);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  const isCashAccount = useWatch({ control, name: 'isCashAccount' });

  const { error, mutate, isLoading } = trpcClient.moneyAcc.edit.useMutation(
    handleUseMutationAlerts({
      successText: 'Su cuenta ha sido editada!',
      callback: () => {
        handleOnClose();
        isCashAccount
          ? context.moneyAcc.getManyCashAccs.invalidate()
          : context.moneyAcc.getManyBankAccs.invalidate();
        context.moneyAcc.getManyWithTransactions.invalidate();
      },
    })
  );

  const submitFunc = async (data: MoneyAccWithBankInfo) => {
    mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          {isCashAccount ? (
            <ModalHeader>Editar una Caja Chica</ModalHeader>
          ) : (
            <ModalHeader>Editar una Cuenta Bancaria</ModalHeader>
          )}
          <ModalCloseButton />
          <ModalBody>
            <SeedButton reset={reset} mock={moneyAccMock} />
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            <EditMoneyAccForm control={control} errors={errors} />
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

export default EditMoneyAccModal;
