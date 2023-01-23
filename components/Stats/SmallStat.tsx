import {
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

const SmallStat = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) => {
  const labelColor = useColorModeValue('gray.600', 'gray.300');
  return (
    <Stat color={color}>
      <StatLabel color={labelColor}>{label}</StatLabel>
      <StatNumber fontSize={{ base: 'lg', md: '2xl' }}>{value}</StatNumber>
    </Stat>
  );
};

export default SmallStat;
