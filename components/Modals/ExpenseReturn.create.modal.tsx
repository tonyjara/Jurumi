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
import { knownErrors } from '@/lib/dictionaries/knownErrors';
import { trpcClient } from '@/lib/utils/trpcClient';
import { handleUseMutationAlerts } from '../Toasts & Alerts/MyToast';
import { reduceExpenseReports } from '@/lib/utils/TransactionUtils';
import { decimalFormat } from '@/lib/utils/DecimalHelpers';
import type { CompleteMoneyReqHome } from '@/pageContainers/home/requests/HomeRequestsPage.home.requests';
import ExpenseReturnForm from '../Forms/ExpenseReturn.form';
import type { FormExpenseReturn } from '@/lib/validations/expenseReturn.validate';
import {
  defaultExpenseReturn,
  validateExpenseReturn,
} from '@/lib/validations/expenseReturn.validate';

const CreateExpenseReturnModal = ({
  isOpen,
  onClose,
  moneyRequest,
}: {
  isOpen: boolean;
  onClose: () => void;
  moneyRequest: CompleteMoneyReqHome;
}) => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormExpenseReturn>({
    defaultValues: defaultExpenseReturn,
    resolver: zodResolver(validateExpenseReturn),
  });
  const handleOnClose = () => {
    reset(defaultExpenseReturn);
    onClose();
  };

  useEffect(() => {
    if (moneyRequest && isOpen) {
      setValue('moneyRequestId', moneyRequest.id);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moneyRequest, isOpen]);

  const { error, mutate, isLoading } =
    trpcClient.expenseReturn.create.useMutation(
      handleUseMutationAlerts({
        successText: 'Su devolución ha sido creada!',
        callback: () => {
          handleOnClose();
          context.moneyRequest.invalidate();
        },
      })
    );

  const submitFunc = async (data: FormExpenseReturn) => {
    mutate(data);
  };

  const pendingAmount = () =>
    decimalFormat(
      moneyRequest.amountRequested.sub(
        reduceExpenseReports(moneyRequest.expenseReports)
      ),
      moneyRequest.currency
    );

  return (
    <Modal size="xl" isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Crear una rendición. <br /> Pendiente: {pendingAmount()}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody>
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            <ExpenseReturnForm
              reset={reset}
              moneyRequest={moneyRequest}
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
              Guardar
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

export default CreateExpenseReturnModal;