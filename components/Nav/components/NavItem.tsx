import { Flex, Icon } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import type { IconType } from 'react-icons';
interface NavItemProps {
  icon: IconType;
  children: React.ReactNode;
  dest: string; //destination
  minimized?: boolean;
  onClose?: () => void;
}
const NavItem = ({
  icon,
  onClose,
  children,
  dest,
  minimized,
}: NavItemProps) => {
  return (
    <Link
      onClick={() => onClose && onClose()}
      href={dest}
      style={{ textDecoration: 'none' }}
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
        justifyContent={minimized ? 'center' : 'left'}
      >
        {icon && (
          <Icon
            mr={minimized ? '0' : '4'}
            fontSize="20px"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {!minimized && children}
      </Flex>
    </Link>
  );
};

export default NavItem;
