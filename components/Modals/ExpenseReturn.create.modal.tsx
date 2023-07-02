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
import {
  reduceExpenseReportsToSetCurrency,
  reduceExpenseReturnsToSetCurrency,
} from "@/lib/utils/TransactionUtils";
import type { CompleteMoneyReqHome } from "@/pageContainers/home/requests/HomeRequestsPage.home.requests";
import ExpenseReturnForm from "../Forms/ExpenseReturn.form";
import type { FormExpenseReturn } from "@/lib/validations/expenseReturn.validate";
import {
  defaultExpenseReturn,
  validateExpenseReturn,
} from "@/lib/validations/expenseReturn.validate";
import { Prisma } from "@prisma/client";
import { decimalFormat } from "@/lib/utils/DecimalHelpers";

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
      })
    );

  const submitFunc = async (data: FormExpenseReturn) => {
    mutate(data);
  };

  const currency = useWatch({ control, name: "currency" });
  const exchangeRate = useWatch({ control, name: "exchangeRate" });

  const totalAmountRequested =
    moneyRequest?.amountRequested ?? new Prisma.Decimal(0);

  const totalAmountReportedOrReturned = moneyRequest
    ? reduceExpenseReportsToSetCurrency({
        expenseReports: moneyRequest.expenseReports,
        currency: moneyRequest.currency,
      }).add(
        reduceExpenseReturnsToSetCurrency({
          expenseReturns: moneyRequest.expenseReturns,
          currency: moneyRequest.currency,
        })
      )
    : new Prisma.Decimal(0);

  const pendingAmount = () => {
    if (!moneyRequest) return new Prisma.Decimal(0);
    if (currency !== moneyRequest.currency) {
      if (currency === "USD") {
        return totalAmountRequested
          .sub(totalAmountReportedOrReturned)
          .dividedBy(exchangeRate ?? 0);
      }
      if (currency === "PYG") {
        return totalAmountRequested
          .sub(totalAmountReportedOrReturned)
          .times(exchangeRate ?? 0);
      }
    }
    return totalAmountRequested.sub(totalAmountReportedOrReturned);
  };

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
