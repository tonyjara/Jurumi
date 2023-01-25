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
import type { FormTaxPayer } from '@/lib/validations/taxtPayer.validate';
import {
  defaultTaxPayer,
  validateTaxPayer,
} from '@/lib/validations/taxtPayer.validate';
import { handleUseMutationAlerts } from '../Toasts & Alerts/MyToast';
import TaxPayerForm from '../Forms/TaxPayer.form';

const EditTaxPayerModal = ({
  isOpen,
  onClose,
  taxPayer,
}: {
  isOpen: boolean;
  onClose: () => void;
  taxPayer: FormTaxPayer;
}) => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormTaxPayer>({
    defaultValues: defaultTaxPayer,
    resolver: zodResolver(validateTaxPayer),
  });

  useEffect(() => {
    if (isOpen) {
      if (!taxPayer.bankInfo) {
        taxPayer.bankInfo = defaultTaxPayer.bankInfo;
      }
      reset(taxPayer);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const { error, mutate, isLoading } = trpcClient.taxPayer.edit.useMutation(
    handleUseMutationAlerts({
      successText: 'El contribuyente ha sido editado.',
      callback: () => {
        context.taxPayer.invalidate();
        reset(defaultTaxPayer);
        onClose();
      },
    })
  );

  const submitFunc = async (data: FormTaxPayer) => {
    mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar un contribuyente</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}

            <TaxPayerForm control={control} errors={errors} />
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

export default EditTaxPayerModal;
