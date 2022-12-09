import React from 'react';
import {
  Td,
  CircularProgress,
  CircularProgressLabel,
  Tooltip,
} from '@chakra-ui/react';
import type { Decimal } from '@prisma/client/runtime';
import { decimalFormat } from '../../../lib/utils/DecimalHelpers';
import type { Currency } from '@prisma/client';

const PercentageCell = ({
  total,
  executed,
  currency,
}: {
  total: Decimal;
  executed: Decimal;
  currency: Currency;
}) => {
  const percentage = executed.dividedBy(total).times(100).toNumber();

  return (
    <Td>
      <Tooltip label={decimalFormat(executed, currency)}>
        <CircularProgress value={percentage} color="green.400">
          <CircularProgressLabel>{percentage}%</CircularProgressLabel>
        </CircularProgress>
      </Tooltip>
    </Td>
  );
};

export default PercentageCell;
