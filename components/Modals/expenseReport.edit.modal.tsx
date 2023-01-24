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
import type { FormExpenseReport } from '@/lib/validations/expenseReport.validate';
import {
  defaultExpenseReportData,
  validateExpenseReport,
} from '@/lib/validations/expenseReport.validate';
import ExpenseReportForm from '../Forms/ExpenseReport.form';
import { handleUseMutationAlerts } from '../Toasts & Alerts/MyToast';

const EditExpenseReportModal = ({
  isOpen,
  onClose,
  expenseReport,
}: {
  isOpen: boolean;
  onClose: () => void;
  expenseReport: FormExpenseReport;
}) => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormExpenseReport>({
    defaultValues: defaultExpenseReportData,
    resolver: zodResolver(validateExpenseReport),
  });

  useEffect(() => {
    if (isOpen) {
      reset(expenseReport);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const { error, mutate, isLoading } =
    trpcClient.expenseReport.edit.useMutation(
      handleUseMutationAlerts({
        successText: 'Su rendición ha sido editada!',
        callback: () => {
          onClose();
          reset();
          context.expenseReport.invalidate();
        },
      })
    );

  const submitFunc = async (data: FormExpenseReport) => {
    mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar una rendición</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}

            <ExpenseReportForm
              reset={reset}
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
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default EditExpenseReportModal;
