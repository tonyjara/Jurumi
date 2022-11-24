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
import type { BankAccount } from '@prisma/client';
import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { knownErrors } from '../../lib/dictionaries/knownErrors';
import { translateCurrencyPrefix } from '../../lib/utils/TranslatedEnums';
import {
  bankNameOptions,
  currencyOptions,
  ownerDocTypeOptions,
} from '../../lib/utils/SelectOptions';
import { trpcClient } from '../../lib/utils/trpcClient';
import {
  defaultBankAccountValues,
  validateBankAccountCreate,
} from '../../lib/validations/bankAcc.create.validate';
import FormControlledMoneyInput from '../Form/FormControlledMoneyInput';
import FormControlledSelect from '../Form/FormControlledSelect';
import FormControlledText from '../Form/FormControlledText';
import { handleUseMutationAlerts } from '../Toasts/MyToast';
import { DevTool } from '@hookform/devtools';
import FormControlledPhoneInput from '../Form/FormControlledPhoneInput';
import FormControlledRadioButtons from '../Form/FormControlledRadioButtons';

const CreateBankAccountModal = ({
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
  } = useForm<BankAccount>({
    defaultValues: defaultBankAccountValues,
    resolver: zodResolver(validateBankAccountCreate),
  });

  const { error, mutate, isLoading } = trpcClient.bankAcc.create.useMutation(
    handleUseMutationAlerts({
      successText: 'Su cuenta bancaria ha sido creada! 🔥',
      callback: () => {
        onClose();
        reset();
        context.bankAcc.getMany.invalidate();
      },
    })
  );

  const submitFunc = async (data: BankAccount) => {
    mutate(data);
  };

  const currency = useWatch({ control, name: 'currency' });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear una cuenta bancaria</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            <VStack spacing={5}>
              <FormControlledSelect
                control={control}
                errors={errors}
                name="bankName"
                label="Seleccione el banco"
                options={bankNameOptions}
              />
              <FormControlledText
                control={control}
                errors={errors}
                name="ownerName"
                label="Nombre y Apellido del titular"
                autoFocus={true}
              />
              <FormControlledText
                control={control}
                errors={errors}
                name="accountNumber"
                label="Número de cuenta"
              />
              <FormControlledSelect
                control={control}
                errors={errors}
                name="ownerDocType"
                label="Tipo de documento"
                options={ownerDocTypeOptions}
              />
              <FormControlledText
                control={control}
                errors={errors}
                name="ownerDoc"
                label="Documento del titular"
              />
              <FormControlledPhoneInput
                control={control}
                errors={errors}
                name="ownerContactNumber"
                label="Celular del titular (Opcional)."
                helperText="Ej: 0981 123 123"
              />
              <FormControlledRadioButtons
                control={control}
                errors={errors}
                name="currency"
                label="Moneda"
                options={currencyOptions}
              />
              <FormControlledMoneyInput
                control={control}
                errors={errors}
                name="balance"
                label="Balance Inicial"
                prefix={translateCurrencyPrefix(currency)}
              />
              <FormControlledText
                control={control}
                errors={errors}
                name="country"
                label="País"
              />
              <FormControlledText
                control={control}
                errors={errors}
                name="city"
                label="Ciudad"
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
      <DevTool control={control} />
    </Modal>
  );
};

export default CreateBankAccountModal;
