import { Button, Text, Heading, HStack, Flex } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { MoneyRequest, Transaction } from '@prisma/client';
import { useRouter } from 'next/router';
import FormContainer from '../components/Containers/FormContainer';
import TransactionForm from '../components/Forms/Transaction.form';
import { handleUseMutationAlerts } from '../components/Toasts/MyToast';
import { knownErrors } from '../lib/dictionaries/knownErrors';
import { trpcClient } from '../lib/utils/trpcClient';
import {
  defaultTransactionValues,
  validateTransaction,
} from '../lib/validations/transaction.validate';
import { translatedMoneyReqType } from '../lib/utils/TranslatedEnums';
import { decimalFormat } from '../lib/utils/DecimalHelpers';

const CreateTransactionPage = ({
  moneyRequest,
}: {
  moneyRequest?: MoneyRequest;
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
  } = useForm<Transaction>({
    defaultValues: defaultTransactionValues,
    resolver: zodResolver(validateTransaction),
  });

  useEffect(() => {
    if (moneyRequest) {
      setValue('moneyRequestId', moneyRequest.id);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, mutate, isLoading } =
    trpcClient.transaction.create.useMutation(
      handleUseMutationAlerts({
        successText: 'Su solicitud ha sido aprobada y ejecutada!',
        callback: () => {
          context.moneyRequest.getMany.invalidate();
          context.moneyRequest.getManyComplete.invalidate();
          reset(defaultTransactionValues);
          handleGoBack();
        },
      })
    );

  const submitFunc = async (data: Transaction) => {
    mutate(data);
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <Heading fontSize={'2xl'}>Crear una transacción</Heading>

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
          </Flex>
        )}
        <TransactionForm
          totalAmount={moneyRequest?.amountRequested}
          control={control}
          errors={errors}
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
