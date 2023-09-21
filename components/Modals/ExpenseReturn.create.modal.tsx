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
import { useForm, useWatch } from "react-hook-form";
import { knownErrors } from "@/lib/dictionaries/knownErrors";
import { trpcClient } from "@/lib/utils/trpcClient";
import { handleUseMutationAlerts } from "../Toasts & Alerts/MyToast";
import { calculateMoneyReqPendingAmount } from "@/lib/utils/TransactionUtils";
import ExpenseReturnForm from "../Forms/ExpenseReturn.form";
import type { FormExpenseReturn } from "@/lib/validations/expenseReturn.validate";
import {
  defaultExpenseReturn,
  validateExpenseReturn,
} from "@/lib/validations/expenseReturn.validate";
import { decimalFormat } from "@/lib/utils/DecimalHelpers";
import { CompleteMoneyReqHome } from "@/pageContainers/home/requests/home.requests.types";

const CreateExpenseReturnModal = ({
  isOpen,
  onClose,
  moneyRequest,
}: {
  isOpen: boolean;
  onClose: () => void;
  moneyRequest: CompleteMoneyReqHome;
}) => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormExpenseReturn>({
    defaultValues: defaultExpenseReturn,
    resolver: zodResolver(validateExpenseReturn),
  });
  const handleOnClose = () => {
    reset(defaultExpenseReturn);
    onClose();
  };

  const { data: org } = trpcClient.org.getCurrent.useQuery();

  useEffect(() => {
    if (moneyRequest && isOpen && org) {
      setValue("moneyRequestId", moneyRequest.id);
      setValue("exchangeRate", org.dolarToGuaraniExchangeRate);
      if (moneyRequest.currency !== defaultExpenseReturn.currency) {
        setValue("wasConvertedToOtherCurrency", true);
      }
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moneyRequest, isOpen, org]);

  const { error, mutate, isLoading } =
    trpcClient.expenseReturn.create.useMutation(
      handleUseMutationAlerts({
        successText: "Su devolución ha sido creada!",
        callback: () => {
          handleOnClose();
          context.moneyRequest.invalidate();
        },
      }),
    );

  const submitFunc = async (data: FormExpenseReturn) => {
    mutate(data);
  };

  const currency = useWatch({ control, name: "currency" });
  const exchangeRate = useWatch({ control, name: "exchangeRate" });

  const pendingAmount = () =>
    calculateMoneyReqPendingAmount({ moneyRequest, currency, exchangeRate });

  const formatedPendingAmount = () => decimalFormat(pendingAmount(), currency);
  return (
    <Modal size="xl" isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Crear una devolución. <br /> Pendiente: {formatedPendingAmount()}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody>
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            <ExpenseReturnForm
              reset={reset}
              moneyRequest={moneyRequest}
              setValue={setValue}
              control={control}
              errors={errors as any}
              pendingAmount={pendingAmount}
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

export default CreateExpenseReturnModal;
