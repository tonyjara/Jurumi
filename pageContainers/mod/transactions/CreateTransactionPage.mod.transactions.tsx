import { Button, Text, Heading, HStack, Flex, Divider } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { MoneyRequest, Transaction } from '@prisma/client';
import { useRouter } from 'next/router';
import FormContainer from '@/components/Containers/FormContainer';
import TransactionForm from '@/components/Forms/Transaction.create.form';
import { handleUseMutationAlerts } from '@/components/Toasts/MyToast';
import { knownErrors } from '@/lib/dictionaries/knownErrors';
import { trpcClient } from '@/lib/utils/trpcClient';
import type { FormTransactionCreate } from '@/lib/validations/transaction.create.validate';
import {
  defaultTransactionCreateData,
  validateTransactionCreate,
} from '@/lib/validations/transaction.create.validate';
import { translatedMoneyReqType } from '@/lib/utils/TranslatedEnums';
import { decimalFormat } from '@/lib/utils/DecimalHelpers';
import { reduceTransactionAmounts } from '@/lib/utils/TransactionUtils';

const CreateTransactionPage = ({
  moneyRequest,
}: {
  moneyRequest?: MoneyRequest & {
    transactions: Transaction[]; // only transactionAmount is selected
  };
}) => {
  const context = trpcClient.useContext();
  const router = useRouter();

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
      setValue('moneyRequestId', moneyRequest.id);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, mutate, isLoading } =
    trpcClient.transaction.createMany.useMutation(
      handleUseMutationAlerts({
        successText: 'Su solicitud ha sido aprobada y ejecutada!',
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

  const amountExecuted = moneyRequest
    ? reduceTransactionAmounts(moneyRequest.transactions).toNumber()
    : 0;

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <Heading fontSize={'2xl'}>Crear transacciones</Heading>

        {error && <Text color="red.300">{knownErrors(error.message)}</Text>}

        {moneyRequest && (
          <Flex flexDirection="column">
            <Text fontSize={'xl'}>
              Tipo de desembolso:{' '}
              {translatedMoneyReqType(moneyRequest.moneyRequestType)}
            </Text>
            <Text fontSize={'xl'}>
              Monto solicitado:{' '}
              <span style={{ fontWeight: 'bold' }}>
                {decimalFormat(
                  moneyRequest.amountRequested,
                  moneyRequest.currency
                )}
              </span>
            </Text>
            <Text fontSize={'xl'}>Concepto: {moneyRequest.description}</Text>
            {amountExecuted > 0 && (
              <Text fontSize={'xl'}>
                Monto ejecutado:{' '}
                <span style={{ fontWeight: 'bold' }}>
                  {decimalFormat(
                    reduceTransactionAmounts(moneyRequest.transactions),
                    moneyRequest.currency
                  )}
                </span>
              </Text>
            )}
          </Flex>
        )}
        <Divider my={'20px'} />
        <TransactionForm
          totalAmount={moneyRequest?.amountRequested}
          amountExecuted={reduceTransactionAmounts(moneyRequest?.transactions)}
          control={control}
          errors={errors}
          setValue={setValue}
        />

        <Text mt={'10px'} color={'red.400'}>
          {errors.id && errors.id.message}
        </Text>

        <HStack mt={'10px'} justifyContent="end">
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
