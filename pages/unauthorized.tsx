"use client";

import { Box, Heading, Text } from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";

export default function Warning() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <WarningTwoIcon boxSize={"50px"} color={"orange.300"} />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Sin autorización
      </Heading>
      <Text color={"gray.500"}>
        No tienes permisos para acceder a esta página.
      </Text>
    </Box>
  );
}
