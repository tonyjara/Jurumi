import React from 'react';
import { Td, Flex, Text } from '@chakra-ui/react';
import type { DynamicCellProps } from '../DynamicTable';

const TextCell = <T extends object>(props: DynamicCellProps<T>) => {
  const { objectKey, data } = props;
  return (
    <Td>
      <Flex direction="column">
        <Text fontSize="sm" fontWeight="bold">
          {data[objectKey] as string}
        </Text>
      </Flex>
    </Td>
  );
};

export default TextCell;
