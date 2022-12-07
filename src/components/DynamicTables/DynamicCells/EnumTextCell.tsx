import React from 'react';
import { Td, Flex, Text, Tooltip } from '@chakra-ui/react';

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
    <Td>
      <Flex direction="column">
        <Tooltip label={hover}>
          <Text fontSize="sm" fontWeight="bold">
            {enumFunc(text)}
          </Text>
        </Tooltip>
      </Flex>
    </Td>
  );
};

export default EnumTextCell;
