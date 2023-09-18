import { MoonIcon, SunIcon } from "@chakra-ui/icons";
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
  Divider,
  Portal,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { FiChevronDown } from "react-icons/fi";
import { signOut } from "next-auth/react";
import NotificationIcon from "./NotificationIcon";

const NavbarProfileSection = () => {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();

  const { data } = useSession();

  return (
    <Flex gap={{ base: "0", md: "1" }}>
      <IconButton
        size="lg"
        variant="ghost"
        onClick={toggleColorMode}
        aria-label="change color theme"
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      />

      <NotificationIcon />
      <Flex pl={"10px"} alignItems={"center"}>
        <Menu>
          {data && (
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  src={data?.user.profile?.avatarUrl ?? undefined}
                />
                <Box
                  display={{ base: "none", md: "flex" }}
                  // alignItems="flex-start"
                  // spacing="1px"
                  flexDir="column"
                  // ml="2"
                  h="30px"
                >
                  <Text fontSize="sm">{data.user.displayName}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {data.user.role}
                  </Text>
                </Box>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
          )}
          <Portal>
            <MenuList>
              <VStack
                display={{ base: "flex", md: "none" }}
                alignItems="flex-start"
                spacing="1px"
                ml="2"
              >
                <Text fontSize="sm">{data?.user.displayName}</Text>
                <Text fontSize="xs" color="gray.600">
                  {data?.user.role}
                </Text>
              </VStack>
              <Divider mt={"10px"} />
              <MenuItem onClick={() => router.push("/home/settings")}>
                Mi cuenta
              </MenuItem>

              <MenuDivider />
              <MenuItem onClick={() => signOut()}>Cerrar sesión</MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default NavbarProfileSection;
