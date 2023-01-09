import type { FlexProps } from '@chakra-ui/react';
import { Flex, Icon } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import type { IconType } from 'react-icons';
interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
  dest: string; //destination
}
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

export default NavItem;
