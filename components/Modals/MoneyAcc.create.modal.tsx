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
import type { FormMoneyAccount } from '../../lib/validations/moneyAcc.validate';
import {
  defaultMoneyAccData,
  validateMoneyAccount,
} from '../../lib/validations/moneyAcc.validate';
import { handleUseMutationAlerts, myToast } from '../Toasts & Alerts/MyToast';
import SeedButton from '../DevTools/SeedButton';
import { moneyAccMock } from '../../__tests__/mocks/Mocks';
import MoneyAccForm from '../Forms/MoneyAcc.form';

const CreateMoneyAccModal = ({
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
  } = useForm<FormMoneyAccount>({
    defaultValues: defaultMoneyAccData,
    resolver: zodResolver(validateMoneyAccount),
  });

  useEffect(() => {
    if (!isOpen) {
      reset(defaultMoneyAccData);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleOnClose = () => {
    reset(defaultMoneyAccData);
    onClose();
  };
  const isCashAccount = useWatch({ control, name: 'isCashAccount' });

  const { data: prefs } = trpcClient.preferences.getMyPreferences.useQuery();
  const { error, mutate, isLoading } = trpcClient.moneyAcc.create.useMutation(
    handleUseMutationAlerts({
      successText: 'Su cuenta bancaria ha sido creada! 🔥',
      callback: () => {
        handleOnClose();

        context.moneyAcc.invalidate();
      },
    })
  );

  const submitFunc = async (data: FormMoneyAccount) => {
    if (!prefs?.selectedOrganization) {
      return myToast.error('Seleccione una organización');
    }
    data.organizationId = prefs.selectedOrganization;
    mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          {isCashAccount ? (
            <ModalHeader>Crear una Caja Chica</ModalHeader>
          ) : (
            <ModalHeader>Crear una Cuenta Bancaria</ModalHeader>
          )}
          <ModalCloseButton />
          <ModalBody>
            <SeedButton reset={reset} mock={moneyAccMock} />
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            <MoneyAccForm control={control} errors={errors} />
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

export default CreateMoneyAccModal;
