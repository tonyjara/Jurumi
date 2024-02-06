import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import { trpcClient } from "../../lib/utils/trpcClient";
import MoneyTransferForm from "../Forms/MoneyTransfer.form";
import {
  FormMoneyAccountTransfer,
  defaultMoneyAccTransferData,
  validateMoneyTransfer,
} from "@/lib/validations/moneyTransfer.validate";
import { handleUseMutationAlerts } from "../Toasts & Alerts/MyToast";

const CreateMoneyAccTransferModal = ({
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
    formState: { errors, isSubmitting },
  } = useForm<FormMoneyAccountTransfer>({
    defaultValues: defaultMoneyAccTransferData,
    resolver: zodResolver(validateMoneyTransfer),
  });

  const handleOnClose = () => {
    reset(defaultMoneyAccTransferData);
    onClose();
  };
  useEffect(() => {
    if (!isOpen) {
      reset(defaultMoneyAccTransferData);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const { mutate: transfer, isLoading } =
    trpcClient.moneyAcc.transferBetweenAcounts.useMutation(
      handleUseMutationAlerts({
        successText: "Los fondos han sido transferidos correctamente",
        callback: () => {
          handleOnClose();

          context.invalidate();
        },
      }),
    );

  const submitFunc = async (data: FormMoneyAccountTransfer) => {
    transfer(data);
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transferir fondos entre cuentas</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <MoneyTransferForm
              control={control}
              errors={errors}
              setValue={setValue}
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

export default CreateMoneyAccTransferModal;
