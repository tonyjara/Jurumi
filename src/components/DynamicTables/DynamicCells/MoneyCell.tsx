import React from 'react';
import { Td, Flex, Text } from '@chakra-ui/react';
import type { DynamicCellProps, IObjectKeys } from '../DynamicTable';
import { decimalFormat } from '../../../lib/utils/DecimalHelpers';
import type { Currency, Prisma } from '@prisma/client';

const MoneyCell = <T extends IObjectKeys>(props: DynamicCellProps<T>) => {
  const { objectKey, data } = props;
  return (
    <Td>
      {'currency' in data ? (
        <Flex direction="column">
          <Text fontSize="sm" fontWeight="bold">
            {decimalFormat(
              data[objectKey] as Prisma.Decimal,
              data.currency as Currency
            )}
          </Text>
        </Flex>
      ) : (
        <Text>Error encontrando la moneda.</Text>
      )}
    </Td>
  );
};

export default MoneyCell;
