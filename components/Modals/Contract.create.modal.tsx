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
import React from "react";
import { useForm } from "react-hook-form";

import { trpcClient } from "../../lib/utils/trpcClient";
import { handleUseMutationAlerts } from "../Toasts & Alerts/MyToast";
import {
  FormContract,
  defaultCreateContractsValues,
  validateContract,
} from "@/lib/validations/createContract.validate";
import ContractForm from "../Forms/Contract.form";

const CreateContractModal = ({
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
  } = useForm<FormContract>({
    defaultValues: defaultCreateContractsValues,
    resolver: zodResolver(validateContract),
  });

  const handleOnClose = () => {
    reset(defaultCreateContractsValues);
    onClose();
  };

  const { mutate: createContract, isLoading } =
    trpcClient.contracts.create.useMutation(
      handleUseMutationAlerts({
        successText: "Su contrato ha sido creado",
        callback: () => {
          handleOnClose();
          context.invalidate();
        },
      }),
    );

  const submitFunc = (data: FormContract) => {
    createContract(data);
  };

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear un contrato</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ContractForm
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

export default CreateContractModal;
