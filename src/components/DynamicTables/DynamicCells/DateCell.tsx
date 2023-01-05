import { Text, useColorModeValue } from '@chakra-ui/react';
import { format } from 'date-fns';
import React from 'react';

const DateCell = ({ date }: { date: Date }) => {
  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
      {format(date, 'dd/MM/yy hh:mm')}
    </Text>
  );
};

export default DateCell;
