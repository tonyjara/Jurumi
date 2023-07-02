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
import type { FormExpenseReport } from "@/lib/validations/expenseReport.validate";
import {
  defaultExpenseReportData,
  validateExpenseReport,
} from "@/lib/validations/expenseReport.validate";
import ExpenseReportForm from "../Forms/ExpenseReport.form";
import { handleUseMutationAlerts } from "../Toasts & Alerts/MyToast";
import { ExpenseReportComplete } from "@/pageContainers/mod/expense-reports/ModExpenseReportsPage.mod.expense-reports";
import { MyExpenseReport } from "@/pageContainers/home/expense-reports/ExpenseReportsPage.home.expense-reports";
import { Prisma } from "@prisma/client";

const EditExpenseReportModal = ({
  isOpen,
  onClose,
  expenseReport,
}: {
  isOpen: boolean;
  onClose: () => void;
  expenseReport: ExpenseReportComplete | MyExpenseReport;
}) => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormExpenseReport>({
    defaultValues: defaultExpenseReportData,
    resolver: zodResolver(validateExpenseReport),
  });

  useEffect(() => {
    if (isOpen) {
      const editExpenseReport: FormExpenseReport = {
        searchableImage: expenseReport.searchableImage,
        taxPayer: {
          razonSocial: expenseReport.taxPayer.razonSocial,
          ruc: expenseReport.taxPayer.ruc,
        },
        id: expenseReport.id,
        createdAt: expenseReport.createdAt,
        updatedAt: null,
        currency: "USD",
        wasConvertedToOtherCurrency: expenseReport.wasConvertedToOtherCurrency,
        exchangeRate: expenseReport.exchangeRate,
        accountId: expenseReport.accountId,
        wasCancelled: false,
        projectId: expenseReport.projectId,
        concept: expenseReport.concept,
        moneyRequestId: expenseReport.moneyRequestId,
        comments: expenseReport.comments,
        costCategoryId: expenseReport.costCategoryId,
        facturaNumber: expenseReport.facturaNumber,
        amountSpent: expenseReport.amountSpent,
        pendingAmount: 0,
        spentAmountIsGraterThanMoneyRequest: false,
        reimburseTo: {
          razonSocial: "",
          ruc: "",
          bankInfo: {
            taxPayerId: "",
            accountNumber: "",
            ownerName: "",
            ownerDoc: "",
            ownerDocType: "CI",
            type: "SAVINGS",
            bankName: "ITAU",
          },
        },
      };
      reset(editExpenseReport);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const { error, mutate, isLoading } =
    trpcClient.expenseReport.edit.useMutation(
      handleUseMutationAlerts({
        successText: "Su rendición ha sido editada!",
        callback: () => {
          onClose();
          reset();
          context.expenseReport.invalidate();
        },
      })
    );

  const submitFunc = async (data: FormExpenseReport) => {
    mutate(data);
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar una rendición</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}

            <ExpenseReportForm
              reset={reset}
              setValue={setValue}
              control={control}
              errors={errors as any}
              isEdit={true}
              // This data is not editable, it should be edited in the reimbursement request
              amountSpentIsBiggerThanPending={false}
              pendingAmount={() => new Prisma.Decimal(0)}
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

export default EditExpenseReportModal;
