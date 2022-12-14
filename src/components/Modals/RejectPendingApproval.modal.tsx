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
import { z } from 'zod';
import { knownErrors } from '../../lib/dictionaries/knownErrors';
import { trpcClient } from '../../lib/utils/trpcClient';
import FormControlledText from '../FormControlled/FormControlledText';
import { handleUseMutationAlerts } from '../Toasts/MyToast';

interface RejectForm {
  moneyRequestId: string;
  rejectMessage: string;
}

const RejectPendingApprovalModal = ({
  isOpen,
  onClose,
  requestId,
}: {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
}) => {
  const context = trpcClient.useContext();
  const defValues = { rejectMessage: '', moneyRequestId: '' };
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RejectForm>({
    defaultValues: defValues,
    resolver: zodResolver(
      z.object({
        rejectMessage: z
          .string({ required_error: 'Favor ingrese un mensaje' })
          .min(6, 'Favor ingrese un mensaje'),
        moneyRequestId: z.string().min(1, ''),
      })
    ),
  });

  useEffect(() => {
    if (requestId) {
      reset({ moneyRequestId: requestId });
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  const { error, mutate, isLoading } =
    trpcClient.moneyApprovals.reject.useMutation(
      handleUseMutationAlerts({
        successText: 'La solicitud ha sido rechazada.',
        callback: () => {
          onClose();
          reset(defValues);
          context.moneyRequest.invalidate();
        },
      })
    );

  const submitFunc = async (data: RejectForm) => {
    mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rechazo de solicitud</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}

            <FormControlledText
              control={control}
              errors={errors}
              name="rejectMessage"
              label="Razón del rechazo"
              isTextArea
              autoFocus={true}
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

export default RejectPendingApprovalModal;
