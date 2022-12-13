import type { FlexProps } from '@chakra-ui/react';
import { Flex, useColorModeValue, IconButton, Text } from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import NavbarProfileSection from './NavbarProfileSection';

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MyTopBar = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      position={'fixed'}
      width="100%"
      zIndex={1}
      // ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      {/*TEXT SHOWN ONLY ON MOBILE */}
      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Logosd
      </Text>
      <NavbarProfileSection />
    </Flex>
  );
};

export default MyTopBar;
