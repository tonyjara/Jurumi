import type { BoxProps, FlexProps } from '@chakra-ui/react';
import { AccordionIcon } from '@chakra-ui/react';
import { AccordionPanel } from '@chakra-ui/react';
import { Accordion, AccordionButton, AccordionItem } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import {
  useColorModeValue,
  Flex,
  CloseButton,
  Text,
  Box,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import type { IconType } from 'react-icons';
import { FiHome, FiSettings, FiUsers, FiGlobe } from 'react-icons/fi';

interface SidebarProps extends BoxProps {
  onClose: () => void;
}
interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
  dest: string; //destination
}

interface LinkItemChild {
  name: string;
  dest: string;
}

interface LinkItemProps {
  name: string;
  icon: IconType;
  dest: string; //destination
  children?: LinkItemChild[];
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { data } = useSession();
  // const isAdmin = data?.user.role === 'ADMIN';
  const isAdminOrMod =
    data?.user.role === 'ADMIN' || data?.user.role === 'MODERATOR';

  // const adminLinks: Array<LinkItemProps> = isAdmin
  //   ? [{ name: 'Usuarios', icon: FiUsers, dest: '/mod/users' }]
  //   : [];
  const adminOrModLinks: Array<LinkItemProps> = isAdminOrMod
    ? [
        {
          name: 'Usuarios',
          icon: FiUsers,
          dest: '/mod/users',
          children: [
            {
              name: 'Links de verificacion',
              dest: '/mod/users/verification-links',
            },
          ],
        },
        { name: 'Vistas', icon: FiGlobe, dest: '/mod/views' },
      ]
    : [];
  const LinkItems: Array<LinkItemProps> = [
    { name: 'Inicio', icon: FiHome, dest: '/home' },

    // ...adminLinks,
    ...adminOrModLinks,

    { name: 'Configuración', icon: FiSettings, dest: '/home/settings' },
  ];
  return (
    <Box
      zIndex={2}
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <div key={link.name}>
          {link.children?.length && (
            <Accordion allowToggle>
              <AccordionItem>
                <AccordionButton>
                  <AccordionIcon />
                  <NavItem icon={link.icon} dest={link.dest}>
                    {link.name}
                  </NavItem>
                </AccordionButton>
                {link.children.map((x) => (
                  <AccordionPanel key={x.name}>
                    <NavItemChild name={x.name} dest={x.dest} />
                  </AccordionPanel>
                ))}
              </AccordionItem>
            </Accordion>
          )}
          {!link.children?.length && (
            <NavItem icon={link.icon} dest={link.dest}>
              {link.name}
            </NavItem>
          )}
        </div>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, dest, ...rest }: NavItemProps) => {
  return (
    <Link
      href={dest}
      style={{ textDecoration: 'none' }}
      // _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const NavItemChild = ({ name, dest }: LinkItemChild) => {
  return (
    <Link
      href={dest}
      style={{ textDecoration: 'none' }}
      // _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="2"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
      >
        {name}
      </Flex>
    </Link>
  );
};
export default SidebarContent;
