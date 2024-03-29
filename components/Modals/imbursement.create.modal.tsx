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
import React from "react";
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

const ImbursementCreateModal = ({
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
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormImbursement>({
    defaultValues: defaultImbursementData,
    resolver: zodResolver(validateImbursement),
  });
  const handleOnClose = () => {
    reset(defaultImbursementData);
    onClose();
  };

  const { error, mutate, isLoading } =
    trpcClient.imbursement.create.useMutation(
      handleUseMutationAlerts({
        successText: "Su desembolso ha sido creado",
        callback: () => {
          handleOnClose();
          context.imbursement.invalidate();
          context.moneyAcc.invalidate();
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
          <ModalHeader>Crear un desembolso </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            <ImbursementForm
              getValues={getValues}
              reset={reset}
              setValue={setValue}
              control={control}
              errors={errors}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={isLoading || isSubmitting}
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

export default ImbursementCreateModal;
