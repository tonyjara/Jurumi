import React from 'react';
import BankAccCard from '../Cards/bankAcc.card';
import { trpcClient } from '@/lib/utils/trpcClient';
import { HStack, Text } from '@chakra-ui/react';
import ErrorBotLottie from '../../Spinners-Loading/ErrorBotLottie';
import type { BankInfo, MoneyAccount, Transaction } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { reduceBankAccValues } from '@/lib/utils/MoneyAccountUtils';
import { decimalFormat } from '@/lib/utils/DecimalHelpers';

export type BankAccsWithLastTx = MoneyAccount & {
  transactions: Transaction[];
  bankInfo: BankInfo | null;
};

const BankAccCardGroup = () => {
  const {
    data: bankAccs,
    isLoading: isBankLoading,
    error: bankError,
  } = trpcClient.moneyAcc.getManyBankAccWithLastTx.useQuery();
  const reduceToGs = (bankAccs?: BankAccsWithLastTx[]) => {
    if (!bankAccs) return new Prisma.Decimal(0);
    return reduceBankAccValues(bankAccs, 'PYG');
  };
  const reduceToUsd = (bankAccs?: BankAccsWithLastTx[]) => {
    if (!bankAccs) return new Prisma.Decimal(0);
    return reduceBankAccValues(bankAccs, 'USD');
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
