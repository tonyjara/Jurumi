import { Flex, useColorModeValue, IconButton } from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import NavbarProfileSection from './NavbarProfileSection';

interface MobileProps {
  onOpen: () => void;
  authenticated: boolean;
}
const MyTopBar = ({ onOpen, authenticated }: MobileProps) => {
  return (
    <Flex
      position={'fixed'}
      width="100%"
      zIndex={1}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      // justifyContent={{ base: 'space-between', md: 'flex-end' }}
      justifyContent={authenticated ? 'space-between' : 'flex-end'}
    >
      {authenticated && (
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu />}
        />
      )}

      <NavbarProfileSection />
    </Flex>
  );
};

export default MyTopBar;
