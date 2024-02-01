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
import { knownErrors } from "@/lib/dictionaries/knownErrors";
import { trpcClient } from "@/lib/utils/trpcClient";
import type { FormTaxPayer } from "@/lib/validations/taxtPayer.validate";
import { FormTaxPayerMock } from "@/lib/validations/taxtPayer.validate";
import {
  defaultTaxPayer,
  validateTaxPayer,
} from "@/lib/validations/taxtPayer.validate";
import SeedButton from "../DevTools/SeedButton";
import TaxPayerForm from "../Forms/TaxPayer.form";
import { handleUseMutationAlerts } from "../Toasts & Alerts/MyToast";

export interface CreateTaxPayerModalSetFuncProps {
  ruc: string;
  razonSocial: string;
  id: string;
  label: string;
}

const CreateTaxPayerModal = ({
  isOpen,
  onClose,
  handleSetRucAndRazonSocialAfterCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  handleSetRucAndRazonSocialAfterCreate?: (
    props: CreateTaxPayerModalSetFuncProps,
  ) => void;
}) => {
  const context = trpcClient.useContext();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormTaxPayer>({
    defaultValues: defaultTaxPayer,
    resolver: zodResolver(validateTaxPayer),
  });

  const handleOnClose = () => {
    reset(defaultTaxPayer);
    onClose();
  };
  const { error, mutate, isLoading } = trpcClient.taxPayer.create.useMutation(
    handleUseMutationAlerts({
      successText: "El contribuyente ha sido creado.",
      callback: (res) => {
        handleSetRucAndRazonSocialAfterCreate &&
          handleSetRucAndRazonSocialAfterCreate({
            razonSocial: res.razonSocial,
            ruc: res.ruc,
            id: res.id,
            label: `(${res.fantasyName} - ${res.razonSocial}`,
          });

        context.taxPayer.invalidate();

        handleOnClose();
      },
    }),
  );

  const submitFunc = async (data: FormTaxPayer) => {
    mutate(data);
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear un contribuyente</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            <SeedButton reset={reset} mock={FormTaxPayerMock} />
            <TaxPayerForm control={control} errors={errors} />
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

export default CreateTaxPayerModal;
