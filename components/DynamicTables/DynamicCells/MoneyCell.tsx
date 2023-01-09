import React from 'react';
import { Text } from '@chakra-ui/react';
import { decimalFormat } from '@/lib/utils/DecimalHelpers';
import type { Currency } from '@prisma/client';
import type { Decimal } from '@prisma/client/runtime';

interface props {
  amount: Decimal;
  currency: Currency;
}

const MoneyCell = (props: props) => {
  const { amount, currency } = props;
  return (
    <Text fontSize="sm" fontWeight="bold">
      {decimalFormat(amount, currency)}
    </Text>
  );
};

export default MoneyCell;
