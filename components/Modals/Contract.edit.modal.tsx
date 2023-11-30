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

import { transformContractForEdit } from "@/pageContainers/mod/contracts/ContractsUtils";
import { trpcClient } from "../../lib/utils/trpcClient";
import { handleUseMutationAlerts } from "../Toasts & Alerts/MyToast";
import {
  FormContract,
  defaultCreateContractsValues,
  validateContract,
} from "@/lib/validations/createContract.validate";
import ContractForm from "../Forms/Contract.form";
import { GetManyContractsType } from "@/pageContainers/mod/contracts/Contract.types";

const ContractEditModal = ({
  onClose,
  contract,
  setEditData,
}: {
  onClose: () => void;
  contract: GetManyContractsType;
  setEditData: React.Dispatch<
    React.SetStateAction<GetManyContractsType | null>
  >;
}) => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormContract>({
    defaultValues: transformContractForEdit(contract),
    resolver: zodResolver(validateContract),
  });

  const handleOnClose = () => {
    reset(defaultCreateContractsValues);

    setEditData(null);
    onClose();
  };

  const { mutate: editContract, isLoading } =
    trpcClient.contracts.edit.useMutation(
      handleUseMutationAlerts({
        successText: "Su contrato ha sido editado",
        callback: () => {
          context.invalidate();
          handleOnClose();
        },
      }),
    );

  const submitFunc = (data: FormContract) => {
    editContract(data);
  };

  return (
    <Modal size="2xl" isOpen={!!contract} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar un contrato</ModalHeader>
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

export default ContractEditModal;
