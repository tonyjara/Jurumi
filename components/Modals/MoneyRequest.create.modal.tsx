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
import { knownErrors } from "@/lib/dictionaries/knownErrors";
import { trpcClient } from "@/lib/utils/trpcClient";
import { handleUseMutationAlerts } from "../Toasts & Alerts/MyToast";
import { FormMoneyRequest } from "@/lib/validations/moneyRequest.validate";
import {
  defaultMoneyRequestData,
  validateMoneyRequest,
} from "@/lib/validations/moneyRequest.validate";
import MoneyRequestForm from "../Forms/MoneyRequest.form";

const CreateMoneyRequestModal = ({
  isOpen,
  onClose,
  orgId,
  incomingMoneyRequest,
}: {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  orgId: string | null;
  //To be able to hook in with contracts, we need to pass the incomingMoneyRequest
  incomingMoneyRequest?: FormMoneyRequest;
}) => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormMoneyRequest>({
    defaultValues: incomingMoneyRequest ?? defaultMoneyRequestData,
    resolver: zodResolver(validateMoneyRequest),
  });

  const handleOnClose = () => {
    reset(defaultMoneyRequestData);
    onClose();
  };

  useEffect(() => {
    if (orgId && isOpen) {
      setValue("organizationId", orgId);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, isOpen]);

  const { error, mutate, isLoading } =
    trpcClient.moneyRequest.create.useMutation(
      handleUseMutationAlerts({
        successText: "Su solicitud ha sido creada!",
        callback: () => {
          handleOnClose();
          context.invalidate();
        },
      }),
    );

  const submitFunc = async (data: FormMoneyRequest) => {
    mutate(data);
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={handleOnClose}>
      <form
        // onSubmit={handleSubmit(submitFunc)}
        noValidate
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear una solicitud de fondos</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            <MoneyRequestForm
              getValues={getValues}
              incomingMoneyRequest={incomingMoneyRequest}
              setValue={setValue}
              control={control}
              errors={errors as any}
              orgId={orgId}
              reset={reset}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={isLoading || isSubmitting}
              // type="submit"
              onClick={() => handleSubmit(submitFunc)()}
              colorScheme="blue"
              mr={3}
            >
              Guardar
            </Button>
            <Button colorScheme="gray" mr={3} onClick={handleOnClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default CreateMoneyRequestModal;
