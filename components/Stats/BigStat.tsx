import {
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

const BigStat = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  const labelColor = useColorModeValue('gray.600', 'gray.300');
  return (
    <Stat>
      <StatLabel color={labelColor} fontSize={{ base: 'md', md: 'lg' }}>
        {label}
      </StatLabel>
      <StatNumber fontSize={{ base: 'lg', md: '3xl' }}>{value}</StatNumber>
    </Stat>
  );
};

export default BigStat;
