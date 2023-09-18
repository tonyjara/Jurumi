import React from "react";
import {
  Box,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  Container,
  Text,
  Flex,
  Image,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import FormControlledText from "../components/FormControlled/FormControlledText";
import type { FormSignin } from "../lib/validations/auth.signin.validate";
import {
  defaultSigninData,
  signinValidation,
} from "../lib/validations/auth.signin.validate";
import { signIn } from "next-auth/react";
import type { GetServerSideProps } from "next";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { myToast } from "../components/Toasts & Alerts/MyToast";
import Link from "next/link";

export default function Signin({ onSubmit }: { onSubmit?: any }) {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormSignin>({
    defaultValues: defaultSigninData,
    resolver: zodResolver(signinValidation),
  });

  const submitSigning = async ({ email, password }: FormSignin) => {
    const x = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (!x?.error) {
      //redirect
      router.push("/home");
    }

    if (x?.error) {
      //handle
      // console.error(x.error);
      myToast.error("Hubo un error favor intente nuevamente.");
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit ?? submitSigning)} noValidate>
        <Stack
          spacing={2}
          // py={{ base: 5, md: 10 }}
          alignContent="center"
        >
          <Flex gap={5} alignSelf={"center"} alignItems={"center"}>
            <Heading
              py={{ base: 0, md: 5 }}
              fontSize={{ base: "2xl", md: "6xl" }}
            >
              Jurumi
            </Heading>
            <Image
              src={"/jurumi-logo.png"}
              alt="logo"
              width={"50px"}
              height={"50px"}
            />
          </Flex>
          <Heading
            textAlign={"center"}
            py={{ base: 0, md: 5 }}
            fontSize={{ base: "2xl", md: "4xl" }}
          >
            Iniciar Sesión
          </Heading>

          <Box
            rounded={"lg"}
            bg={{
              base: "-moz-initial",
              md: useColorModeValue("white", "gray.700"),
            }}
            boxShadow={{ base: "none", md: "lg" }}
            p={5}
            minW={{ base: "full", md: "lg" }}
            maxW="xl"
          >
            <Stack spacing={2}>
              <FormControlledText
                label={"Email"}
                errors={errors}
                control={control}
                autoFocus={true}
                name="email"
                type="email"
                helperText={"Favor ingrese su email."}
              />
              <FormControlledText
                label={"Contraseña"}
                errors={errors}
                control={control}
                name="password"
                type="password"
              />

              <Button
                isDisabled={isSubmitting}
                type="submit"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Iniciar Sesión
              </Button>
              <Link href={"forgot-my-password"}>
                <Text color={"gray.500"} pt={"10px"}>
                  Olvide mi contraseña
                </Text>
              </Link>
            </Stack>
          </Box>
        </Stack>
      </form>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { p = "/" } = ctx.query;

  const session = await getServerAuthSession(ctx);

  const destination = () => {
    if (p.toString().length === 1) return "/home";
    return p.toString();
  };

  if (session) {
    return {
      redirect: {
        destination: destination(),
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};
