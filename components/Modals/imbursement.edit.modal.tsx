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
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { knownErrors } from "../../lib/dictionaries/knownErrors";
import { trpcClient } from "../../lib/utils/trpcClient";
import { handleUseMutationAlerts } from "../Toasts & Alerts/MyToast";
import ImbursementForm from "../Forms/Imbursement.form";
import type { FormImbursement } from "@/lib/validations/imbursement.validate";
import {
  defaultImbursementData,
  validateImbursement,
} from "@/lib/validations/imbursement.validate";

const ImbursementEditModal = ({
  isOpen,
  onClose,
  imbursement,
}: {
  isOpen: boolean;
  onClose: () => void;
  imbursement: FormImbursement;
}) => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    getValues,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormImbursement>({
    defaultValues: defaultImbursementData,
    resolver: zodResolver(validateImbursement),
  });

  useEffect(() => {
    if (isOpen) {
      reset(imbursement);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleOnClose = () => {
    reset(defaultImbursementData);
    onClose();
  };

  const { error, mutate, isLoading } = trpcClient.imbursement.edit.useMutation(
    handleUseMutationAlerts({
      successText: "Su desembolso ha sido editado",
      callback: () => {
        handleOnClose();
        context.imbursement.invalidate();
      },
    }),
  );

  const submitFunc = async (data: FormImbursement) => {
    mutate(data);
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar un desembolso</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            <ImbursementForm
              getValues={getValues}
              isEditForm={true}
              setValue={setValue}
              control={control}
              errors={errors}
              reset={reset}
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

export default ImbursementEditModal;
