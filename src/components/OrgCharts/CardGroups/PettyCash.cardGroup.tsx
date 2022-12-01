import React from 'react';
import { trpcClient } from '../../../lib/utils/trpcClient';
import { HStack, Text } from '@chakra-ui/react';
import ErrorBotLottie from '../../Spinners-Loading/ErrorBotLottie';
import PettyCashCard from '../Cards/pettyCash.card';
import type { MoneyAccount } from '@prisma/client';

const PettyCashCardGroup = () => {
  const { data, isLoading, error } =
    trpcClient.moneyAcc.getManyCashAccs.useQuery();
  const reduceToGs = (cashAccs?: MoneyAccount[]) =>
    cashAccs
      ?.reduce((acc, cashAcc) => {
        if (cashAcc.currency === 'PYG') {
          return (acc += parseFloat(cashAcc.initialBalance.toString()));
        }
        return acc;
      }, 0)
      .toLocaleString('es');
  const reduceToUsd = (cashAccs?: MoneyAccount[]) =>
    cashAccs
      ?.reduce((acc, cashAcc) => {
        if (cashAcc.currency === 'USD') {
          return (acc += parseFloat(cashAcc.initialBalance.toString()));
        }
        return acc;
      }, 0)
      .toLocaleString('en-US');
  return (
    <>
      {!isLoading && (
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
            Cajas chicas. Total Dólares: {reduceToUsd(data)} Total Guaraníes:{' '}
            {reduceToGs(data)}
          </Text>
          <HStack>
            {data?.map((pettyCash) => (
              <PettyCashCard key={pettyCash.id} {...pettyCash} />
            ))}
          </HStack>
        </fieldset>
      )}
      {error && <ErrorBotLottie />}
    </>
  );
};

export default PettyCashCardGroup;
