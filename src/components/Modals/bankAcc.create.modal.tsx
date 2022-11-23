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
import { Organization, Prisma } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { knownErrors } from '../../lib/dictionaries/knownErrors';
import { parsedPrefix } from '../../lib/utils/ParsedEnums';
import { bankNameOptions } from '../../lib/utils/SelectOptions';
import { trpcClient } from '../../lib/utils/trpcClient';
import {
  defaultBankAccountValues,
  validateBankAccountCreate,
} from '../../lib/validations/bankAcc.create.validate';
import { validateOrgCreate } from '../../lib/validations/org.create.validate';
import FormControlledMoneyInput from '../Form/FormControlledMoneyInput';
import FormControlledNumberInput from '../Form/FormControlledNumberInput';
import FormControlledSelect from '../Form/FormControlledSelect';
import FormControlledText from '../Form/FormControlledText';
import { handleUseMutationAlerts } from '../Toasts/MyToast';

const CreateBankAccountModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { data: session } = useSession();
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

  const { error, mutate, isLoading } = trpcClient.org.create.useMutation(
    handleUseMutationAlerts({
      successText: 'Su cuenta bancaria ha sido creada! 🔥',
      callback: () => {
        onClose();
        reset();
        // context.org.getMany.invalidate();
      },
    })
  );

  const submitFunc = async (data: BankAccount) => {
    console.log(data.balance);

    // const user = session?.user;
    // if (!user) return;
    // data.createdById = user.id;
    // mutate(data);
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

            <FormControlledText
              control={control}
              errors={errors}
              name="ownerName"
              label="Nombre y Apellido del titular"
              autoFocus={true}
            />
            <FormControlledSelect
              control={control}
              errors={errors}
              name="bankName"
              label="Nombre y Apellido del titular"
              options={bankNameOptions}
            />
            <FormControlledMoneyInput
              control={control}
              errors={errors}
              name="balance"
              label="Balance Inicial"
              prefix={parsedPrefix(currency)}
            />
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

export default CreateBankAccountModal;
