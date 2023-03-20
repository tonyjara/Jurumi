import React from 'react';
import { Text } from '@chakra-ui/react';

const Badge = ({
  number,
  children,
}: {
  number: number;
  children: React.ReactElement;
}) => {
  return (
    <div>
      <div
        style={{
          top: '2px',
          right: '2px',
          backgroundColor: 'red',
          position: 'absolute',
          width: '15px',
          height: '15px',
          borderRadius: '50px',
          display: number < 2 ? 'none' : 'block',
        }}
      >
        <Text fontSize={'sm'}>{number}</Text>
      </div>
      {children}{' '}
    </div>
  );
};

export default Badge;
