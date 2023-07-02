import { Button, Text, Heading, HStack, Flex, Divider } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import type {
  Currency,
  ExpenseReport,
  ExpenseReturn,
  MoneyRequest,
  Transaction,
} from "@prisma/client";
import { useRouter } from "next/router";
import FormContainer from "@/components/Containers/FormContainer";
import TransactionForm from "@/components/Forms/Transaction.create.form";
import { handleUseMutationAlerts } from "@/components/Toasts & Alerts/MyToast";
import { knownErrors } from "@/lib/dictionaries/knownErrors";
import { trpcClient } from "@/lib/utils/trpcClient";
import type { FormTransactionCreate } from "@/lib/validations/transaction.create.validate";
import { transactionMock } from "@/lib/validations/transaction.create.validate";
import {
  defaultTransactionCreateData,
  validateTransactionCreate,
} from "@/lib/validations/transaction.create.validate";
import { translatedMoneyReqType } from "@/lib/utils/TranslatedEnums";
import { decimalFormat } from "@/lib/utils/DecimalHelpers";
import {
  formatedAccountBalance,
  reduceTransactionAmountsToSetCurrency,
} from "@/lib/utils/TransactionUtils";
import SeedButton from "@/components/DevTools/SeedButton";

export type MoneyRequestForCreateTransactionPage = MoneyRequest & {
  transactions: Transaction[]; // only transactionAmount is selected
  expenseReports: ExpenseReport[];
  expenseReturns: ExpenseReturn[];
};

const CreateTransactionPage = ({
  moneyRequest,
}: {
  moneyRequest: MoneyRequestForCreateTransactionPage;
}) => {
  const context = trpcClient.useContext();
  const router = useRouter();

  const { data: moneyAccs } =
    trpcClient.moneyAcc.getManyWithTransactions.useQuery();

  const moneyAccOptions = (currency: Currency) =>
    moneyAccs
      ?.filter((x) => x.currency === currency)
      .map((acc) => ({
        value: acc.id,
        label: `${acc.displayName} ${formatedAccountBalance(acc)}`,
      }));

  const handleGoBack = () => {
    router.back();
  };
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormTransactionCreate>({
    defaultValues: defaultTransactionCreateData,
    resolver: zodResolver(validateTransactionCreate),
  });

  useEffect(() => {
    if (moneyRequest) {
      setValue("moneyRequestId", moneyRequest.id);
      setValue("projectId", moneyRequest.projectId);
      setValue("costCategoryId", moneyRequest.costCategoryId);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, mutate, isLoading } =
    trpcClient.transaction.createMany.useMutation(
      handleUseMutationAlerts({
        successText: "Su solicitud ha sido aprobada y ejecutada!",
        callback: () => {
          context.moneyRequest.invalidate();
          context.moneyAcc.invalidate();
          reset(defaultTransactionCreateData);
          handleGoBack();
        },
      })
    );

  const submitFunc = async (data: FormTransactionCreate) => {
    mutate(data);
  };

  const amountExecuted = reduceTransactionAmountsToSetCurrency({
    transactions: moneyRequest.transactions,
    currency: moneyRequest.currency,
  });
  const pendingAmount = moneyRequest.amountRequested.sub(amountExecuted);

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <Heading fontSize={"2xl"}>Crear transacciones</Heading>

        {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
        {moneyRequest && (
          <SeedButton
            reset={reset}
            mock={() => transactionMock(moneyRequest, moneyAccOptions)}
          />
        )}
        {moneyRequest && (
          <Flex flexDirection="column">
            <Text mb="20px" fontSize={"xl"}>
              <span style={{ fontWeight: "bold" }}>Tipo de desembolso: </span>
              {translatedMoneyReqType(moneyRequest.moneyRequestType)}
            </Text>
            <Text fontSize={"xl"}>
              <span style={{ fontWeight: "bold" }}>Monto solicitado: </span>
              <span style={{ fontWeight: "bold" }}>
                {decimalFormat(
                  moneyRequest.amountRequested,
                  moneyRequest.currency
                )}
              </span>
            </Text>

            {amountExecuted.toNumber() > 0 && (
              <Text fontSize={"xl"}>
                Monto ejecutado:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {decimalFormat(
                    reduceTransactionAmountsToSetCurrency({
                      transactions: moneyRequest.transactions,
                      currency: moneyRequest.currency,
                    }),
                    moneyRequest.currency
                  )}
                </span>
              </Text>
            )}

            {pendingAmount.toNumber() > 0 && (
              <Text fontSize={"xl"}>
                Monto pendiente:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {decimalFormat(pendingAmount, moneyRequest.currency)}
                </span>
              </Text>
            )}
            <Text marginTop="20px" fontSize={"xl"}>
              <span style={{ fontWeight: "bold" }}>Concepto:</span>
              {moneyRequest.description}
            </Text>
            <Text fontSize={"xl"}>
              <span style={{ fontWeight: "bold" }}>Comentarios: </span>
              {moneyRequest.comments.length ? moneyRequest.comments : "-"}
            </Text>
          </Flex>
        )}
        <Divider my={"40px"} />
        <TransactionForm
          moneyRequest={moneyRequest}
          control={control}
          errors={errors}
          setValue={setValue}
          moneyAccOptions={moneyAccOptions}
        />

        <Text mt={"10px"} color={"red.400"}>
          {errors.id && errors.id.message}
        </Text>

        <HStack mt={"10px"} justifyContent="end">
          <Button colorScheme="gray" mr={3} onClick={handleGoBack}>
            Volver
          </Button>
          <Button
            disabled={isLoading || isSubmitting}
            type="submit"
            colorScheme="blue"
            mr={3}
          >
            Guardar
          </Button>
        </HStack>
      </form>
    </FormContainer>
  );
};

export default CreateTransactionPage;
