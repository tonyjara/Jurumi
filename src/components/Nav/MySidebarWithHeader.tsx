import type { ReactNode } from 'react';
import React from 'react';
import {
  Box,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/react';

import MyTopBar from './MyTopBar';
import SidebarContent from './SidebarContent';
import { useSession } from 'next-auth/react';

export default function MySidebarWithHeader({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { status } = useSession();
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      {status === 'authenticated' && (
        <SidebarContent
          onClose={() => onClose}
          display={{ base: 'none', md: 'block' }}
        />
      )}
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MyTopBar onOpen={onOpen} />

      <Box
        py={{ base: '100px', md: '100px' }}
        px={{ base: '10px', md: '10px' }}
        ml={{ base: 0, md: 60 }}
      >
        {children}
      </Box>
    </Box>
  );
}
