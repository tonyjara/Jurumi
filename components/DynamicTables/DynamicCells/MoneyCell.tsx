import React from 'react';
import { Text } from '@chakra-ui/react';
import { decimalFormat } from '@/lib/utils/DecimalHelpers';
import type { Currency } from '@prisma/client';
import type { Decimal } from '@prisma/client/runtime';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';

interface props {
  amount: Decimal;
  currency: Currency;

  arrow?: 'up' | 'down';
}

const MoneyCell = ({ amount, currency, arrow }: props) => {
  return (
    <Text fontSize="sm" fontWeight="bold">
      {arrow === 'down' && <TriangleDownIcon color={'red.300'} mr={'2px'} />}
      {arrow === 'up' && <TriangleUpIcon color={'green.300'} mr={'2px'} />}

      {decimalFormat(amount, currency)}
    </Text>
  );
};

export default MoneyCell;
