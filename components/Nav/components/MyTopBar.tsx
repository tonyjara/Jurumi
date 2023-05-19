import {
  Text,
  Image,
  Flex,
  useColorModeValue,
  IconButton,
  Box,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiMenu } from "react-icons/fi";
import NavbarProfileSection from "./NavbarProfileSection";

interface MobileProps {
  onOpen: () => void;
  authenticated: boolean;
}
const MyTopBar = ({ onOpen, authenticated }: MobileProps) => {
  const router = useRouter();

  return (
    <Flex
      position={"fixed"}
      width="100%"
      zIndex={1}
      px={{ base: 4, md: 4 }}
      height="65px"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{
        base: "space-between",
        md: "space-between",
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Image
          onClick={() => router.push("/")}
          ml={authenticated ? "80px" : undefined}
          display={{ base: authenticated ? "none" : "flex", md: "flex" }}
          src={"/jurumi-logo.png"}
          alt="logo"
          width={"30px"}
          height={"30px"}
          cursor="pointer"
          mr="10px"
        />
        {!authenticated && (
          <Link href={"/become-member"}>
            <Button variant={"ghost"}>Asociarse</Button>
          </Link>
        )}
        {authenticated && (
          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={onOpen}
            variant="outline"
            aria-label="open menu"
            icon={<FiMenu />}
          />
        )}
      </div>
      <Box>
        <NavbarProfileSection />
      </Box>
    </Flex>
  );
};

export default MyTopBar;
