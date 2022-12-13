import React from 'react';
import { Td, Flex, Text, Tooltip } from '@chakra-ui/react';

const TextCell = ({ text, hover }: { text: string; hover?: string }) => {
  return (
    <Td>
      <Flex direction="column">
        <Tooltip label={hover}>
          <Text fontSize="sm" fontWeight="bold">
            {text}
          </Text>
        </Tooltip>
      </Flex>
    </Td>
  );
};

export default TextCell;
