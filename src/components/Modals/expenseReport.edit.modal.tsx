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
import type { ExpenseReport } from '@prisma/client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { knownErrors } from '../../lib/dictionaries/knownErrors';
import { trpcClient } from '../../lib/utils/trpcClient';
import type { OrgWithApproversAndMoneyAdmins } from '../../lib/validations/org.validate';
import {
  defaultOrgData,
  validateOrgCreate,
} from '../../lib/validations/org.validate';
import ExpenseReportForm from '../Forms/ExpenseReport.form';

import OrgForm from '../Forms/Org.form';
import { handleUseMutationAlerts } from '../Toasts/MyToast';

const EditExpenseReportModal = ({
  isOpen,
  onClose,
  expenseReport,
}: {
  isOpen: boolean;
  onClose: () => void;
  expenseReport: ExpenseReport;
}) => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseReport>({
    defaultValues: defaultOrgData,
    resolver: zodResolver(validateOrgCreate),
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

  const submitFunc = async (data: ExpenseReport) => {
    //   mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar una organización</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}

            {/* <ExpenseReportForm
              setValue={setValue}
              control={control}
              errors={errors as any}
            /> */}
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

export default EditExpenseReportModal;
