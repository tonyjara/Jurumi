import { Td, Text, useColorModeValue } from '@chakra-ui/react';
import { format } from 'date-fns';
import React from 'react';
import type { DynamicCellProps } from '../DynamicTable';

const DateCell = <T extends object>(props: DynamicCellProps<T>) => {
  const { data, objectKey } = props;
  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <Td>
      <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
        {format(data[objectKey] as Date, 'dd/MM/yy hh:mm')}
      </Text>
    </Td>
  );
};

export default DateCell;
