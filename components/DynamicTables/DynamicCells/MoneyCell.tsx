import React from 'react';
import { Text } from '@chakra-ui/react';
import { decimalFormat } from '@/lib/utils/DecimalHelpers';
import type { Currency } from '@prisma/client';
import type { Decimal } from '@prisma/client/runtime';

interface props {
  amount: Decimal;
  currency: Currency;
  negative?: boolean;
}

const MoneyCell = ({ amount, currency, negative }: props) => {
  return (
    <Text fontSize="sm" fontWeight="bold">
      {negative && '-'}
      {decimalFormat(amount, currency)}
    </Text>
  );
};

export default MoneyCell;
