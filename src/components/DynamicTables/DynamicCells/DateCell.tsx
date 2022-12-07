import { Td, Text, useColorModeValue } from '@chakra-ui/react';
import { format } from 'date-fns';
import React from 'react';
import type { DynamicCellProps, IObjectKeys } from '../DynamicTable';

const DateCell = ({ date }: { date: Date }) => {
  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <Td>
      <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
        {format(date, 'dd/MM/yy hh:mm')}
      </Text>
    </Td>
  );
};

export default DateCell;
