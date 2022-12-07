import React from 'react';
import { Td, Flex, Text } from '@chakra-ui/react';

const TextCell = ({ text }: { text: string }) => {
  return (
    <Td>
      <Flex direction="column">
        <Text fontSize="sm" fontWeight="bold">
          {text}
        </Text>
      </Flex>
    </Td>
  );
};

export default TextCell;
