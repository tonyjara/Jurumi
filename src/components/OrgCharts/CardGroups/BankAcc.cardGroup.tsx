import React from 'react';
import BankAccCard from '../Cards/bankAcc.card';
import { trpcClient } from '../../../lib/utils/trpcClient';
import { HStack, Text } from '@chakra-ui/react';
import ErrorBotLottie from '../../Spinners-Loading/ErrorBotLottie';
import type { MoneyAccount } from '@prisma/client';

const BankAccCardGroup = () => {
  const {
    data: bankAccs,
    isLoading: isBankLoading,
    error: bankError,
  } = trpcClient.moneyAcc.getManyBankAccs.useQuery();
  const reduceToGs = (bankAccs?: MoneyAccount[]) =>
    bankAccs
      ?.reduce((acc, bankAcc) => {
        if (bankAcc.currency === 'PYG') {
          return (acc += parseFloat(bankAcc.initialBalance.toString()));
        }
        return acc;
      }, 0)
      .toLocaleString('es');
  const reduceToUsd = (bankAccs?: MoneyAccount[]) =>
    bankAccs
      ?.reduce((acc, bankAcc) => {
        if (bankAcc.currency === 'USD') {
          return (acc += parseFloat(bankAcc.initialBalance.toString()));
        }
        return acc;
      }, 0)
      .toLocaleString('en-US');
  return (
    <>
      {!isBankLoading && (
        <fieldset
          style={{
            borderWidth: '1px',
            borderRadius: '8px',
            padding: '10px',
            borderStyle: 'solid',
            borderColor: 'purple',
            margin: '10px',
          }}
        >
          <Text fontWeight={'bold'} as={'legend'}>
            Cuentas bancarias. Total Dólares: {reduceToUsd(bankAccs)} Total
            Guaraníes: {reduceToGs(bankAccs)}
          </Text>
          <HStack>
            {bankAccs?.map((bankAcc) => (
              <BankAccCard key={bankAcc.id} {...bankAcc} />
            ))}
          </HStack>
        </fieldset>
      )}
      {bankError && <ErrorBotLottie />}
    </>
  );
};

export default BankAccCardGroup;
