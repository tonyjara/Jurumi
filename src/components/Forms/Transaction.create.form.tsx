import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  HStack,
  IconButton,
  VStack,
  Text,
  Button,
  useColorModeValue,
  CircularProgress,
  CircularProgressLabel,
  Flex,
} from '@chakra-ui/react';
import type { Currency } from '@prisma/client';
import { Prisma } from '@prisma/client';
import type { Decimal } from '@prisma/client/runtime';
import React from 'react';
import type { FieldValues, Control, FieldErrorsImpl } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { currencyOptions } from '../../lib/utils/SelectOptions';
import {
  formatedAccountBalance,
  reduceTransactionFields,
} from '../../lib/utils/TransactionUtils';
import { translateCurrencyPrefix } from '../../lib/utils/TranslatedEnums';
import { trpcClient } from '../../lib/utils/trpcClient';
import type {
  FormTransaction,
  TransactionField,
} from '../../lib/validations/transaction.create.validate';
import FormControlledMoneyInput from '../FormControlled/FormControlledMoneyInput';

import FormControlledRadioButtons from '../FormControlled/FormControlledRadioButtons';
import FormControlledSelect from '../FormControlled/FormControlledSelect';

interface formProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrorsImpl<T>;
  totalAmount?: Decimal;
  amountExecuted: Decimal;
}

const TransactionForm = ({
  control,
  errors,
  totalAmount,
  amountExecuted,
}: formProps<FormTransaction>) => {
  const { fields, prepend, remove, update } = useFieldArray({
    control,
    name: 'transactions',
  });

  const {
    data: moneyAccs,
    // isLoading: isMoneyAccLoading,
    // error: isMoneyAccError,
  } = trpcClient.moneyAcc.getManyWithTransactions.useQuery();

  // const currency = useWatch({ control, name: 'currency' });

  const moneyAccOptions = (currency: Currency) =>
    moneyAccs
      ?.filter((x) => x.currency === currency)
      .map((acc) => ({
        value: acc.id,
        label: `${acc.displayName} ${formatedAccountBalance(acc)}`,
      }));

  const defaultTransaction: TransactionField = {
    currency: 'PYG',
    transactionAmount: new Prisma.Decimal(0),
    moneyAccountId: '',
    transactionProofUrl: '',
  };

  const containerBorder = useColorModeValue('gray.100', 'white');

  const transactions = useWatch({ control, name: 'transactions' });

  const formAmounts = reduceTransactionFields(transactions).add(amountExecuted);
  const percentage = totalAmount
    ? formAmounts.dividedBy(totalAmount).times(100).toFixed(0)
    : '0';

  return (
    <>
      <HStack justifyContent={'space-between'}>
        <CircularProgress value={parseInt(percentage)} color="green.400">
          <CircularProgressLabel>{percentage}%</CircularProgressLabel>
        </CircularProgress>
        <Button
          onClick={() => prepend(defaultTransaction)}
          aria-label="add"
          rightIcon={<AddIcon />}
        >
          Agregar otra extracción
        </Button>
      </HStack>
      {fields.map((x, index) => {
        const currency = x.currency;
        const resetAccountSelectValues = () => {
          update(index, {
            moneyAccountId: '',
            currency,
            transactionProofUrl: '',
            transactionAmount: new Prisma.Decimal(0),
          });
        };
        return (
          <VStack
            borderColor={containerBorder}
            borderWidth={'3px'}
            borderRadius="8px"
            p={'10px'}
            my="10px"
            key={x.id}
            spacing={5}
          >
            <Flex w={'100%'} justifyContent={'space-between'}>
              <Text fontWeight={'bold'} fontSize={'lg'} alignSelf={'start'}>
                Extracción {index + 1}
              </Text>
              <IconButton
                disabled={transactions.length < 2}
                onClick={() => remove(index)}
                aria-label="remove"
                icon={<DeleteIcon />}
              />
            </Flex>
            <FormControlledRadioButtons
              control={control}
              errors={errors}
              name={`transactions.${index}.currency`}
              label="Moneda"
              options={currencyOptions}
              onChangeMw={resetAccountSelectValues}
            />
            <FormControlledSelect
              control={control}
              errors={errors}
              name={`transactions.${index}.moneyAccountId`}
              label="Seleccione un medio de extracción"
              options={moneyAccOptions(currency) ?? []}
              isClearable={true}
              error={
                (errors.transactions &&
                  errors.transactions[index]?.moneyAccountId?.message) ??
                ''
              }
            />
            <FormControlledMoneyInput
              control={control}
              errors={errors}
              name={`transactions.${index}.transactionAmount`}
              label="Monto"
              prefix={translateCurrencyPrefix(currency)}
              currency={currency}
              totalAmount={totalAmount?.sub(formAmounts)}
            />
          </VStack>
        );
      })}
    </>
  );
};

export default TransactionForm;
