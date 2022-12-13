import React from 'react';
import { Td, Flex, Text, Tooltip } from '@chakra-ui/react';

const TextCell = ({
  text,
  hover,
  shortenString,
}: {
  text: string;
  hover?: string;
  shortenString?: boolean;
}) => {
  return (
    <Td>
      <Flex direction="column">
        <Tooltip label={hover}>
          <Text
            style={
              shortenString
                ? {
                    textOverflow: 'ellipsis',
                    width: '100px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }
                : {}
            }
            fontSize="sm"
            fontWeight="bold"
          >
            {text}
          </Text>
        </Tooltip>
      </Flex>
    </Td>
  );
};

export default TextCell;
