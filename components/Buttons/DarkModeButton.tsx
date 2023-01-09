import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useColorMode, Button } from '@chakra-ui/react';
import React from 'react';

const DarkModeButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button size={'sm'} onClick={toggleColorMode}>
      {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
};

export default DarkModeButton;
