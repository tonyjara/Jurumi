import React from 'react';
import { trpcClient } from '../../../lib/utils/trpcClient';
import { HStack, Text } from '@chakra-ui/react';
import ErrorBotLottie from '../../Spinners-Loading/ErrorBotLottie';
import PettyCashCard from '../Cards/pettyCash.card';
import type { MoneyAccWithTransactions } from '../../../pageContainers/mod.money-accounts/MoneyAccountsPage.mod.money-accounts';
import { Prisma } from '@prisma/client';
import { decimalFormat } from '../../../lib/utils/DecimalHelpers';
import { reduceMoneyAccountValues } from '../../../lib/utils/MoneyAccountUtils';

const PettyCashCardGroup = () => {
  const { data, isLoading, error } =
    trpcClient.moneyAcc.getManyCashAccs.useQuery();

  const reduceToGs = (cashAccs?: MoneyAccWithTransactions[]) => {
    if (!cashAccs) return new Prisma.Decimal(0);
    return reduceMoneyAccountValues(cashAccs, 'PYG');
  };
  const reduceToUsd = (cashAccs?: MoneyAccWithTransactions[]) => {
    if (!cashAccs) return new Prisma.Decimal(0);
    return reduceMoneyAccountValues(cashAccs, 'USD');
  };

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
            Cajas chicas. Total Dólares:{' '}
            {decimalFormat(reduceToUsd(data), 'USD')} Total Guaraníes:{' '}
            {decimalFormat(reduceToGs(data), 'PYG')}
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
