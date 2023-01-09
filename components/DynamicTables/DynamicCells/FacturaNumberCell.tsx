import React from 'react';
import { Text, Tooltip } from '@chakra-ui/react';

const FacturaNumberCell = ({
  text,
  hover,
  shortenString,
}: {
  text: string;
  hover?: string | React.ReactNode;
  shortenString?: boolean;
}) => {
  return (
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
            : { whiteSpace: 'nowrap' }
        }
        fontSize="sm"
        fontWeight="bold"
      >
        {text.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
      </Text>
    </Tooltip>
  );
};

export default FacturaNumberCell;
