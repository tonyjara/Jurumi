import {
  Button,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  Center,
  MenuDivider,
  MenuItem,
  Box,
  VStack,
  Text,
} from '@chakra-ui/react';
import type { Session } from 'next-auth';
import React from 'react';
import { signOut } from 'next-auth/react';
import { BiLogOut } from 'react-icons/bi';
const ProfileButton = ({ session }: { session: Session }) => {
  return (
    <Box>
      <Menu>
        <MenuButton
          as={Button}
          rounded={'full'}
          variant={'link'}
          cursor={'pointer'}
          minW={0}
        >
          <Avatar
            size={'sm'}
            src={'https://avatars.dicebear.com/api/male/username.svg'}
          />
        </MenuButton>
        <MenuList alignItems={'center'}>
          <br />
          <Center>
            <Avatar
              size={'2xl'}
              src={'https://avatars.dicebear.com/api/male/username.svg'}
            />
          </Center>
          <br />
          {/* <Center> */}
          <VStack spacing={1}>
            <Text>Nombre: {session.user?.displayName}</Text>
            <Text>Correo: {session.user?.email}</Text>
            <Text>Rol: {session.user?.role}</Text>
          </VStack>
          {/* </Center> */}
          <br />
          <MenuDivider />
          {/* <MenuItem>Your Servers</MenuItem> */}
          {/* <MenuItem>Account Settings</MenuItem> */}
          <MenuItem
            icon={<BiLogOut fontWeight={'bold'} size={'20px'} />}
            onClick={() => signOut()}
          >
            Cerrar sesión
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default ProfileButton;
