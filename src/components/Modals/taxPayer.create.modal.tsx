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
import React from 'react';
import { useForm } from 'react-hook-form';
import { knownErrors } from '../../lib/dictionaries/knownErrors';
import { trpcClient } from '../../lib/utils/trpcClient';
import {
  defaultTaxPayer,
  taxPayerValidate,
} from '../../lib/validations/taxtPayer.validate';
import { taxPayerMock } from '../../__tests__/mocks/Mocks';
import SeedButton from '../DevTools/SeedButton';
import FormControlledText from '../FormControlled/FormControlledText';
import { handleUseMutationAlerts } from '../Toasts/MyToast';

const CreateTaxPayerModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: any;
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

  const handleOnClose = () => {
    reset(defaultTaxPayer);
    onClose();
  };
  const { error, mutate, isLoading } = trpcClient.taxPayer.create.useMutation(
    handleUseMutationAlerts({
      successText: 'El contribuyente ha sido creado.',
      callback: () => {
        context.taxPayer.invalidate();

        handleOnClose();
      },
    })
  );

  const submitFunc = async (data: TaxPayer) => {
    mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(onSubmit ?? submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear un contribuyente</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            <SeedButton reset={reset} mock={taxPayerMock} />
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

export default CreateTaxPayerModal;
