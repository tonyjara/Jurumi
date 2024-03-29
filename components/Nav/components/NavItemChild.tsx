import { Flex, Text, Icon, Tooltip } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import type { IconType } from "react-icons";
export interface LinkItemChild {
  icon: IconType;
  dest: string; //destination
  minimized?: boolean;
  onClose?: () => void;
  name: string;
}
const NavItemChild = ({ name, dest, icon, minimized }: LinkItemChild) => {
  const router = useRouter();
  const isCurrentLocation = router.asPath === dest;
  return (
    <Link
      href={dest}
      style={{ textDecoration: "none" }}
      // _focus={{ boxShadow: 'none' }}
    >
      <Tooltip
        hasArrow
        openDelay={0}
        placement="auto"
        isDisabled={!minimized}
        label={name}
      >
        <Flex
          align="center"
          mx={minimized ? "-2" : "0"}
          my={minimized ? "-1" : "-2"}
          mb={minimized ? "-4" : "-5"}
          px={minimized ? "0" : "0"}
          py={minimized ? "2" : "4"}
          pl={minimized ? "4" : "4"}
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: "cyan.400",
            color: "white",
          }}
          justifyContent={minimized ? "center" : "left"}
        >
          {icon && (
            <Icon
              color={isCurrentLocation ? "teal.300" : undefined}
              mr={minimized ? "4" : "4"}
              _groupHover={{
                color: "white",
              }}
              as={icon}
              fontSize="20px"
            />
          )}
          <Text fontSize="12px">{!minimized && name}</Text>
        </Flex>
      </Tooltip>
    </Link>
  );
};
export default NavItemChild;
