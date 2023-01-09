import { Flex } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
export interface LinkItemChild {
  name: string;
  dest: string;
}
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
export default NavItemChild;
