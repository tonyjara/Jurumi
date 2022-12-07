import React from 'react';
import { Td, Flex, Text } from '@chakra-ui/react';
import type { DynamicCellProps, IObjectKeys } from '../DynamicTable';

const ObjectKeyCell = <T extends IObjectKeys>(props: DynamicCellProps<T>) => {
  const { objectKey, data } = props;
  const splitKey = objectKey.split('.');
  const firstKey = splitKey[0];
  const secondKey = splitKey[1];

  return (
    <Td>
      <Flex direction="column">
        <Text fontSize="sm" fontWeight="bold">
          {firstKey && !secondKey && data[firstKey]}
          {firstKey && secondKey && data[firstKey][secondKey]}
        </Text>
      </Flex>
    </Td>
  );
};

export default ObjectKeyCell;
