import { Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import React from 'react';

const DateCell = ({ date }: { date: Date }) => {
  return (
    <Text fontSize="md" fontWeight="bold" pb=".5rem">
      {format(date, 'dd/MM/yy hh:mm')}
    </Text>
  );
};

export default DateCell;
