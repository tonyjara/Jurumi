import { Box, Heading, Text, Button } from "@chakra-ui/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, teal.400, teal.600)"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Página no encontrada{" "}
      </Text>
      <Text color={"gray.500"} mb={6}>
        La página que estás buscando no existe o ha sido movida.
      </Text>

      <Button
        as={Link}
        href="/"
        colorScheme="teal"
        bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
        color="white"
        variant="solid"
      >
        Volver al inicio
      </Button>
    </Box>
  );
}
