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
import SeedButton from "../DevTools/SeedButton";
import {
  FormMoneyRequest,
  MockMoneyRequest,
} from "@/lib/validations/moneyRequest.validate";
import {
  defaultMoneyRequestData,
  validateMoneyRequest,
} from "@/lib/validations/moneyRequest.validate";
import MoneyRequestForm from "../Forms/MoneyRequest.form";

const CreateMoneyRequestModal = ({
  isOpen,
  onClose,
  orgId,
}: {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  orgId: string | null;
}) => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormMoneyRequest>({
    defaultValues: defaultMoneyRequestData,
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
          context.moneyRequest.invalidate();
        },
      })
    );

  const submitFunc = async (data: FormMoneyRequest) => {
    mutate(data);
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear una solicitud de fondos</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            <MoneyRequestForm
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
              type="submit"
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
