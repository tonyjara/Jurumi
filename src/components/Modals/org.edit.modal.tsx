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
import { knownErrors } from '../../lib/dictionaries/knownErrors';
import { trpcClient } from '../../lib/utils/trpcClient';
import type { OrgWithApproversAndMoneyAdmins } from '../../lib/validations/org.validate';
import {
  defaultOrgData,
  validateOrgCreate,
} from '../../lib/validations/org.validate';

import OrgForm from '../Forms/Org.form';
import { handleUseMutationAlerts } from '../Toasts/MyToast';

const EditOrgModal = ({
  isOpen,
  onClose,
  org,
}: {
  isOpen: boolean;
  onClose: () => void;
  org: OrgWithApproversAndMoneyAdmins;
}) => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrgWithApproversAndMoneyAdmins>({
    defaultValues: defaultOrgData,
    resolver: zodResolver(validateOrgCreate),
  });

  useEffect(() => {
    if (isOpen) {
      reset(org);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const { error, mutate, isLoading } = trpcClient.org.edit.useMutation(
    handleUseMutationAlerts({
      successText: 'Su organización ha sido editada! ✏️',
      callback: () => {
        onClose();
        reset();
        context.org.getMany.invalidate();
        context.org.getMyOrgs.invalidate();
      },
    })
  );

  const submitFunc = async (data: OrgWithApproversAndMoneyAdmins) => {
    mutate(data);
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

            <OrgForm control={control} errors={errors as any} />
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

export default EditOrgModal;
