import React from 'react';
import BankAccCard from '../Cards/bankAcc.card';
import { trpcClient } from '@/lib/utils/trpcClient';
import { HStack, Text } from '@chakra-ui/react';
import ErrorBotLottie from '../../Spinners-Loading/ErrorBotLottie';
import { Prisma } from '@prisma/client';
import { reduceMoneyAccountValues } from '@/lib/utils/MoneyAccountUtils';
import { decimalFormat } from '@/lib/utils/DecimalHelpers';
import type { MoneyAccWithTransactions } from '@/pageContainers/mod/money-accounts/MoneyAccountsPage.mod.money-accounts';

const BankAccCardGroup = () => {
  const {
    data: bankAccs,
    isLoading: isBankLoading,
    error: bankError,
  } = trpcClient.moneyAcc.getManyBankAccs.useQuery();
  const reduceToGs = (bankAccs?: MoneyAccWithTransactions[]) => {
    if (!bankAccs) return new Prisma.Decimal(0);
    return reduceMoneyAccountValues(bankAccs, 'PYG');
  };
  const reduceToUsd = (bankAccs?: MoneyAccWithTransactions[]) => {
    if (!bankAccs) return new Prisma.Decimal(0);
    return reduceMoneyAccountValues(bankAccs, 'USD');
  };
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
            Cuentas bancarias. Total Dólares:
            {decimalFormat(reduceToUsd(bankAccs), 'USD')} Total Guaraníes:{' '}
            {decimalFormat(reduceToGs(bankAccs), 'PYG')}
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