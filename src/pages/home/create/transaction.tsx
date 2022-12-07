import { Button, Text, Heading, HStack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import type { MoneyRequest, Transaction } from '@prisma/client';
import { useSession } from 'next-auth/react';
import SeedButton from '../../../components/DevTools/SeedButton';
import TransactionForm from '../../../components/Forms/Transaction.form';
import { handleUseMutationAlerts } from '../../../components/Toasts/MyToast';
import { knownErrors } from '../../../lib/dictionaries/knownErrors';
import { trpcClient } from '../../../lib/utils/trpcClient';
import {
  defaultTransactionValues,
  validateTransaction,
} from '../../../lib/validations/transaction.validate';
import { transactionMock } from '../../../__tests__/mocks/Mocks';
import FormContainer from '../../../components/Containers/FormContainer';
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next';

const CreateTransactionPage = ({ query }: { query?: Transaction }) => {
  const context = trpcClient.useContext();
  const { data: session } = useSession();
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
    if (!query) return;
    if ('moneyRequestId' in query) {
      setValue('moneyRequestId', router.query.moneyRequestId as string);
    }
    if ('expenseReturnId' in query) {
      setValue('expenseReturnId', router.query.expenseReturnId as string);
    }
    if ('imbursementId' in query) {
      setValue('imbursementId', router.query.imbursementId as string);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, mutate, isLoading } =
    trpcClient.moneyRequest.create.useMutation(
      handleUseMutationAlerts({
        successText: 'Su solicitud ha sido creada!',
        callback: () => {
          context.moneyRequest.getMany.invalidate();
          context.moneyRequest.getManyWithAccounts.invalidate();
        },
      })
    );

  const submitFunc = async (data: Transaction) => {
    console.log(data);

    //   mutate(data);
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <Heading fontSize={'2xl'}>Crear una transacción</Heading>
        {/* <ModalCloseButton /> */}
        {/* <VStack> */}
        <SeedButton reset={reset} mock={transactionMock} />
        {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
        <TransactionForm control={control} errors={errors} />
        {/* </VStack> */}

        <Text mt={'10px'} color={'red.400'}>
          {errors.id && errors.id.message}
        </Text>

        <HStack mt={'10px'} justifyContent="end">
          <Button
            disabled={isLoading || isSubmitting}
            type="submit"
            colorScheme="blue"
            mr={3}
          >
            Guardar
          </Button>
          <Button colorScheme="gray" mr={3} onClick={handleGoBack}>
            Volver
          </Button>
        </HStack>
      </form>
    </FormContainer>
  );
};

export default CreateTransactionPage;
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      query: ctx.query,
    },
  };
};
