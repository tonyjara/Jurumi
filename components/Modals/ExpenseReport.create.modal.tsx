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
  useDisclosure,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { knownErrors } from "@/lib/dictionaries/knownErrors";
import { trpcClient } from "@/lib/utils/trpcClient";
import { handleUseMutationAlerts } from "../Toasts & Alerts/MyToast";
import type { FormExpenseReport } from "@/lib/validations/expenseReport.validate";
import {
  defaultExpenseReportData,
  validateExpenseReport,
} from "@/lib/validations/expenseReport.validate";
import ExpenseReportForm from "../Forms/ExpenseReport.form";
import { calculateMoneyReqPendingAmount } from "@/lib/utils/TransactionUtils";
import { decimalFormat } from "@/lib/utils/DecimalHelpers";
import { CompleteMoneyReqHome } from "@/pageContainers/home/requests/home.requests.types";
import Decimal from "decimal.js";
import { ConfirmDialog } from "../Toasts & Alerts/ConfirmDialog";

const CreateExpenseReportModal = ({
  isOpen,
  onClose,
  moneyRequest,
}: {
  isOpen: boolean;
  onClose: () => void;
  moneyRequest: CompleteMoneyReqHome;
}) => {
  const context = trpcClient.useContext();
  const [confirmData, setConfirmData] = useState<{
    showAlert: boolean;
    data: FormExpenseReport;
    conflictingDataId: string | null;
  } | null>(null);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormExpenseReport>({
    defaultValues: defaultExpenseReportData,
    resolver: zodResolver(validateExpenseReport),
  });
  const handleOnClose = () => {
    reset(defaultExpenseReportData);
    onClose();
  };

  const { data: org } = trpcClient.org.getCurrent.useQuery();

  useEffect(() => {
    if (moneyRequest && isOpen && org) {
      setValue("projectId", moneyRequest.projectId);
      setValue("moneyRequestId", moneyRequest.id);
      setValue("exchangeRate", org.dolarToGuaraniExchangeRate);
      if (moneyRequest.currency !== defaultExpenseReportData.currency) {
        setValue("wasConvertedToOtherCurrency", true);
      }
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moneyRequest, isOpen, org]);

  const { error, mutate, isLoading } =
    trpcClient.expenseReport.create.useMutation(
      handleUseMutationAlerts({
        successText: "Su rendición ha sido creada!",
        callback: () => {
          handleOnClose();
          context.moneyRequest.invalidate();
        },
      }),
    );

  const { mutate: checkData, isLoading: isLoadingCheckData } =
    trpcClient.expenseReport.checkIfFacturaNumberAndTaxPayerAreTheSame.useMutation(
      {
        onSuccess: (data) => {
          if (data.showAlert) {
            return setConfirmData(data);
          }
          mutate(data.data);
        },
      },
    );
  const handleConfirmWithConflict = () => {
    if (!confirmData) return;
    mutate(confirmData.data);
  };
  const handleCloseConfirm = () => {
    setConfirmData(null);
  };

  const currency = useWatch({ control, name: "currency" });
  const exchangeRate = useWatch({ control, name: "exchangeRate" });

  const pendingAmount = () =>
    calculateMoneyReqPendingAmount({ moneyRequest, currency, exchangeRate });
  const formatedPendingAmount = () => decimalFormat(pendingAmount(), currency);
  const amountSpent = useWatch({ control, name: "amountSpent" }) as
    | Decimal
    | string
    | number;

  // When deleting the input field completely this solves error that crashes the app
  const amountSpentIsBiggerThanPending =
    typeof amountSpent === "object"
      ? !!amountSpent.greaterThan(pendingAmount())
      : false;

  const watchAmountIsBigger = useWatch({
    control,
    name: "spentAmountIsGraterThanMoneyRequest",
  });

  useEffect(() => {
    if (amountSpentIsBiggerThanPending && !watchAmountIsBigger) {
      setValue("spentAmountIsGraterThanMoneyRequest", true);
    }

    if (!amountSpentIsBiggerThanPending && watchAmountIsBigger) {
      setValue("spentAmountIsGraterThanMoneyRequest", false);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountSpentIsBiggerThanPending]);

  const submitFunc = async (data: FormExpenseReport) => {
    if (amountSpentIsBiggerThanPending) {
      data.pendingAmount =
        pendingAmount().toNumber() > 0 ? pendingAmount() : data.amountSpent;
      data.spentAmountIsGraterThanMoneyRequest = true;
    }

    checkData(data);

    // mutate(data);
  };

  return (
    <>
      <ConfirmDialog
        dialogTitle="¿Estas seguro que deseas crear esta rendición?"
        dialogText={`Encontramos una rendición con id ${confirmData?.conflictingDataId} existente con el mismo número de factura y el mismo contribuyente. ¿Aún asi deseas crear esta rendición?`}
        isOpen={!!confirmData}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmWithConflict}
      />
      <Modal size="xl" isOpen={isOpen} onClose={handleOnClose}>
        <form onSubmit={handleSubmit(submitFunc)} noValidate>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Crear una rendición. <br /> Pendiente: {formatedPendingAmount()}
            </ModalHeader>

            <ModalCloseButton />
            <ModalBody>
              {error && (
                <Text color="red.300">{knownErrors(error.message)}</Text>
              )}
              <ExpenseReportForm
                reset={reset}
                amountSpentIsBiggerThanPending={amountSpentIsBiggerThanPending}
                getValues={getValues}
                moneyRequest={moneyRequest}
                setValue={setValue}
                control={control}
                errors={errors as any}
                pendingAmount={pendingAmount}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                isDisabled={isLoading || isSubmitting || isLoadingCheckData}
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
    </>
  );
};

export default CreateExpenseReportModal;
