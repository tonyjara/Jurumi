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
import { formatedAccountBalance } from "@/lib/utils/TransactionUtils";
import { decimalFormat } from "@/lib/utils/DecimalHelpers";
import { defaultExpenseReturn } from "@/lib/validations/expenseReturn.validate";
import {
  defaultMoneyAccountOffset,
  FormMoneyAccounOffset,
  validateMoneyAccountOffset,
} from "@/lib/validations/moneyAccountOffset.validate";
import MoneyAccountOffsetForm from "../Forms/MoneyAccountOffset.form";
import type { MoneyAccWithTransactions } from "@/pageContainers/mod/money-accounts/MoneyAccountsPage.mod.money-accounts";
import { Prisma } from "@prisma/client";
import SeedButton from "../DevTools/SeedButton";
import { moneyAccountOffsetMock } from "@/__tests__/mocks/Mocks";

const CreateMoneyAccountOffsetModal = ({
  isOpen,
  onClose,
  moneyAccount,
  setOffsetData,
}: {
  isOpen: boolean;
  onClose: () => void;
  moneyAccount: MoneyAccWithTransactions | null;
  setOffsetData: React.Dispatch<
    React.SetStateAction<MoneyAccWithTransactions | null>
  >;
}) => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormMoneyAccounOffset>({
    defaultValues: defaultMoneyAccountOffset,
    resolver: zodResolver(validateMoneyAccountOffset),
  });
  const handleOnClose = () => {
    setOffsetData(null);
    reset(defaultExpenseReturn);
    onClose();
  };

  useEffect(() => {
    if (!isOpen || !moneyAccount) return;
    reset({
      ...defaultMoneyAccountOffset,
      moneyAccountId: moneyAccount.id,
      currency: moneyAccount.currency,
      // if there are no previous transacion take the initial value of the moneyAccount
      // this balance is only for display purposes
      previousBalance: moneyAccount.transactions.length
        ? moneyAccount.transactions[0]?.currentBalance
        : moneyAccount.initialBalance,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, moneyAccount]);

  const { error, mutate, isLoading } =
    trpcClient.moneyAcc.offsetBalance.useMutation(
      handleUseMutationAlerts({
        successText: "El balance ha sido ajustado!",
        callback: () => {
          handleOnClose();
          context.invalidate();
        },
      }),
    );

  const submitFunc = async (data: FormMoneyAccounOffset) => {
    mutate(data);
  };

  const offsettedAmount = useWatch({ control, name: "offsettedAmount" });
  const isSubstraction = useWatch({ control, name: "isSubstraction" });
  return (
    <Modal size="xl" isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Ajustar balance de cuenta &quot;{moneyAccount?.displayName}&quot;
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody>
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            {moneyAccount && (
              <SeedButton
                reset={reset}
                mock={() =>
                  moneyAccountOffsetMock({
                    moneyAccountId: moneyAccount.id,
                    currency: moneyAccount.currency,
                    previousBalance: moneyAccount.transactions.length
                      ? moneyAccount.transactions[0]?.currentBalance
                      : moneyAccount.initialBalance,
                  })
                }
              />
            )}

            {moneyAccount && (
              <Text mb={"20px"} fontSize={"2xl"}>
                Balance actual:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {formatedAccountBalance(moneyAccount)}
                </span>
                <br /> Balance despues del ajuste:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {" "}
                  {isSubstraction &&
                    moneyAccount.transactions[0]?.currentBalance &&
                    decimalFormat(
                      moneyAccount?.transactions[0].currentBalance.sub(
                        offsettedAmount ?? new Prisma.Decimal(0),
                      ),
                      moneyAccount?.currency,
                    )}
                  {!isSubstraction &&
                    moneyAccount.transactions[0]?.currentBalance &&
                    decimalFormat(
                      moneyAccount?.transactions[0].currentBalance.add(
                        offsettedAmount ?? new Prisma.Decimal(0),
                      ),
                      moneyAccount?.currency,
                    )}
                </span>
              </Text>
            )}
            <MoneyAccountOffsetForm control={control} errors={errors as any} />
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

export default CreateMoneyAccountOffsetModal;
