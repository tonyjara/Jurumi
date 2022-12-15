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
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TaxPayer } from '@prisma/client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { knownErrors } from '../../lib/dictionaries/knownErrors';
import { trpcClient } from '../../lib/utils/trpcClient';
import {
  defaultTaxPayer,
  taxPayerValidate,
} from '../../lib/validations/taxtPayer.validate';
import FormControlledText from '../FormControlled/FormControlledText';
import { handleUseMutationAlerts } from '../Toasts/MyToast';

const EditTaxPayerModal = ({
  isOpen,
  onClose,
  taxPayer,
}: {
  isOpen: boolean;
  onClose: () => void;
  taxPayer: TaxPayer;
}) => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaxPayer>({
    defaultValues: defaultTaxPayer,
    resolver: zodResolver(taxPayerValidate),
  });

  useEffect(() => {
    if (isOpen) {
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

  const submitFunc = async (data: TaxPayer) => {
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

            <VStack spacing={5}>
              <FormControlledText
                control={control}
                errors={errors}
                name="razonSocial"
                label="Razón social"
              />
              <FormControlledText
                control={control}
                errors={errors}
                name="ruc"
                label="R.U.C."
              />
              <FormControlledText
                control={control}
                errors={errors}
                name="fantasyName"
                label="Nombre de fantasía (opcional)"
              />
            </VStack>
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

export default EditTaxPayerModal;
