import React from 'react';
import { Text, Tooltip } from '@chakra-ui/react';

const EnumTextCell = ({
  text,
  enumFunc,
  hover,
}: {
  text: string;
  hover?: string;
  enumFunc: (x: any) => string;
}) => {
  return (
    <Tooltip label={hover}>
      <Text fontSize="sm" fontWeight="bold">
        {enumFunc(text)}
      </Text>
    </Tooltip>
  );
};

export default EnumTextCell;
