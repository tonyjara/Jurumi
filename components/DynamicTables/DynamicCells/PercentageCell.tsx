import React from 'react';
import {
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
  const percentage = executed.dividedBy(total).times(100).toFixed(0);

  return (
    <Tooltip label={decimalFormat(executed, currency)}>
      <CircularProgress
        value={isNaN(parseInt(percentage)) ? 0 : parseInt(percentage)}
        color={parseInt(percentage) < 100 ? 'orange.400' : 'green.400'}
      >
        <CircularProgressLabel>
          {isNaN(parseInt(percentage)) ? '0' : percentage}%
        </CircularProgressLabel>
      </CircularProgress>
    </Tooltip>
  );
};

export default PercentageCell;
