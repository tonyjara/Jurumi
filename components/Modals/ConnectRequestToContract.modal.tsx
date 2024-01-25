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
import { trpcClient } from "../../lib/utils/trpcClient";
import { handleUseMutationAlerts } from "../Toasts & Alerts/MyToast";
import FormControlledText from "../FormControlled/FormControlledText";
import { z } from "zod";
import { GetManyContractsType } from "@/pageContainers/mod/contracts/Contract.types";

const validateConnect: z.ZodType<{ moneyRequestIds: string }> = z.object({
  moneyRequestIds: z.string().min(1, "Debe tener al menos 1 caracter"),
});

type FormValidateConnect = z.infer<typeof validateConnect>;

const ConnectRequestToContractModal = ({
  onClose,
  contract,
}: {
  onClose: () => void;
  contract: GetManyContractsType;
}) => {
  const context = trpcClient.useContext();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValidateConnect>({
    defaultValues: { moneyRequestIds: "" },
    resolver: zodResolver(validateConnect),
  });
  const handleOnClose = () => {
    reset();
    onClose();
  };
  const { mutate: connectRequests, isLoading } =
    trpcClient.contracts.connectRequests.useMutation(
      handleUseMutationAlerts({
        successText: "Se ha/n conectado la/s solicitud/es con el contrato",
        callback: () => {
          handleOnClose();
          reset();
          context.invalidate();
        },
      }),
    );

  const submitFunc = (data: FormValidateConnect) => {
    connectRequests({
      contractId: contract.id,
      moneyRequestIds: data.moneyRequestIds,
    });
  };

  return (
    <Modal size="xl" isOpen={!!contract} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Conectar una solicitud con un contrato</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControlledText
              control={control}
              name="moneyRequestIds"
              label="ID de la solicitud de dinero"
              helperText="El ID de la solicitud de dinero es el ID que desea conectar, si son más de una, separe los ID con una coma (,)"
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
              Conectar
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

export default ConnectRequestToContractModal;
