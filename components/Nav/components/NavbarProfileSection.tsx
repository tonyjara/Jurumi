import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
  HStack,
  IconButton,
  Flex,
  Menu,
  MenuButton,
  Avatar,
  VStack,
  MenuList,
  MenuItem,
  MenuDivider,
  Box,
  Text,
  useColorMode,
  Button,
  Divider,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import { FiBell, FiChevronDown } from 'react-icons/fi';
import { signOut } from 'next-auth/react';

const NavbarProfileSection = () => {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();

  const { data } = useSession();

  const onToggleLanguageClick = (newLocale: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };
  const changeTo = router.locale === 'en' ? 'es' : 'en';

  const flagIcon = () => (router.locale === 'en' ? '🇺🇲' : '🇪🇸');

  return (
    <HStack spacing={{ base: '0', md: '1' }}>
      <IconButton
        size="lg"
        variant="ghost"
        onClick={toggleColorMode}
        aria-label="change color theme"
        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      />
      <Button variant="ghost" onClick={() => onToggleLanguageClick(changeTo)}>
        {flagIcon()}
      </Button>
      <IconButton
        size="lg"
        variant="ghost"
        aria-label="open menu"
        icon={<FiBell />}
      />
      <Flex zIndex={99999} alignItems={'center'}>
        <Menu>
          {data && (
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
            >
              <HStack>
                <Avatar
                  size={'sm'}
                  //   src={
                  //     'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  //   }
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{data.user.displayName}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {data.user.role}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
          )}
          <MenuList>
            <VStack
              display={{ base: 'flex', md: 'none' }}
              alignItems="flex-start"
              spacing="1px"
              ml="2"
            >
              <Text fontSize="sm">{data?.user.displayName}</Text>
              <Text fontSize="xs" color="gray.600">
                {data?.user.role}
              </Text>
            </VStack>
            <Divider mt={'10px'} />
            <MenuItem>Mi cuenta</MenuItem>

            <MenuDivider />
            <MenuItem onClick={() => signOut()}>Cerrar sesión</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </HStack>
  );
};

export default NavbarProfileSection;
