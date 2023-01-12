import React from 'react';
import { trpcClient } from '@/lib/utils/trpcClient';
import { HStack, Text } from '@chakra-ui/react';
import ErrorBotLottie from '../../Spinners-Loading/ErrorBotLottie';
import PettyCashCard from '../Cards/pettyCash.card';
import type { MoneyAccount, Transaction } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { decimalFormat } from '@/lib/utils/DecimalHelpers';
import type {} from '@/pageContainers/mod/money-accounts/MoneyAccountsPage.mod.money-accounts';
import { reduceCashAccValues } from '@/lib/utils/MoneyAccountUtils';

export type CashAccsWithLastTx = MoneyAccount & {
  transactions: Transaction[];
};

const PettyCashCardGroup = () => {
  const { data, isLoading, error } =
    trpcClient.moneyAcc.getManyCashAccsWithLastTx.useQuery();

  const reduceToGs = (cashAccs?: CashAccsWithLastTx[]) => {
    if (!cashAccs) return new Prisma.Decimal(0);
    return reduceCashAccValues(cashAccs, 'PYG');
  };
  const reduceToUsd = (cashAccs?: CashAccsWithLastTx[]) => {
    if (!cashAccs) return new Prisma.Decimal(0);
    return reduceCashAccValues(cashAccs, 'USD');
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
