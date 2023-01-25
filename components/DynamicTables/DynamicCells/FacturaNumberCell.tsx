import React from 'react';
import { Text, Tooltip } from '@chakra-ui/react';
import { formatedFacturaNumber } from '@/lib/utils/FacturaUtils';

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
        {formatedFacturaNumber(text)}
      </Text>
    </Tooltip>
  );
};

export default FacturaNumberCell;
