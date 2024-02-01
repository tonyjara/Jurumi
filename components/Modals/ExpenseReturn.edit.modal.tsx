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
import { Prisma } from "@prisma/client";
import {
  defaultExpenseReturn,
  FormExpenseReturn,
  validateExpenseReturn,
} from "@/lib/validations/expenseReturn.validate";
import { ExpenseReturnComplete } from "@/pageContainers/mod/expense-returns/ModExpenseReturnsPage.mod.expense-returns";
import ExpenseReturnForm from "../Forms/ExpenseReturn.form";

const EditExpenseReturnModal = ({
  isOpen,
  onClose,
  expenseReturn,
}: {
  isOpen: boolean;
  onClose: () => void;
  expenseReturn: ExpenseReturnComplete;
}) => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormExpenseReturn>({
    defaultValues: defaultExpenseReturn,
    resolver: zodResolver(validateExpenseReturn),
  });

  useEffect(() => {
    if (isOpen) {
      const editExpenseReturn: FormExpenseReturn = {
        id: expenseReturn.id,
        createdAt: expenseReturn.createdAt,
        updatedAt: null,
        currency: expenseReturn.currency,
        wasConvertedToOtherCurrency: expenseReturn.wasConvertedToOtherCurrency,
        exchangeRate: expenseReturn.exchangeRate,
        accountId: expenseReturn.accountId,
        wasCancelled: false,
        moneyRequestId: expenseReturn.moneyRequestId,
        amountReturned: expenseReturn.amountReturned,
        searchableImage: {
          imageName: expenseReturn.searchableImage?.imageName ?? "",
          url: expenseReturn.searchableImage?.url ?? "",
        },
        moneyAccountId: expenseReturn.moneyAccountId,
      };
      reset(editExpenseReturn);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const { error, mutate, isLoading } =
    trpcClient.expenseReturn.edit.useMutation(
      handleUseMutationAlerts({
        successText: "Su devolución ha sido editada!",
        callback: () => {
          onClose();
          reset();
          context.invalidate();
        },
      }),
    );

  const submitFunc = async (data: FormExpenseReturn) => {
    mutate(data);
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar una devolución</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}

            <ExpenseReturnForm
              reset={reset}
              getValues={getValues}
              setValue={setValue}
              control={control}
              errors={errors as any}
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

export default EditExpenseReturnModal;
