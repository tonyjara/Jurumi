import { Button } from '@chakra-ui/react';
import React from 'react';

//* This component only shows on dev, it's meant not to manually load info on forms.

const SeedButton = ({ reset, mock }: { reset: any; mock: () => object }) => {
  const dev = process.env.NODE_ENV === 'development';

  return (
    <>
      {dev && (
        <Button
          onClick={() => {
            reset(mock());
          }}
          colorScheme="purple"
        >
          Seed Me daddy
        </Button>
      )}
    </>
  );
};

export default SeedButton;
