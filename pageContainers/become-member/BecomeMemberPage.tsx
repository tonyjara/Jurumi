import SeedButton from "@/components/DevTools/SeedButton";
import BecomeMemberForm from "@/components/Forms/becomeMember.form";
import { handleUseMutationAlerts } from "@/components/Toasts & Alerts/MyToast";
import { trpcClient } from "@/lib/utils/trpcClient";
import {
  defaultBecomeMemberRequestData,
  FormBecomeMemberRequest,
  mockBecomeMemberRequest,
  validateBecomeMemberRequest,
} from "@/lib/validations/becomeMember.validate";
import {
  defaultMemberData,
  FormMember,
  validateMember,
} from "@/lib/validations/member.validate";
import { BecomeMemberPageProps } from "@/pages/become-member";
import {
  Text,
  Box,
  Container,
  Button,
  useDisclosure,
  ScaleFade,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BiCheckboxMinus } from "react-icons/bi";

const BecomeMemberPage = ({ query }: { query: BecomeMemberPageProps }) => {
  const { isOpen, onToggle } = useDisclosure();
  const context = trpcClient.useContext();
  const backgroundColor = useColorModeValue("white", "gray.800");

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormBecomeMemberRequest>({
    defaultValues: defaultBecomeMemberRequestData(query.organizationId ?? ""),
    resolver: zodResolver(validateBecomeMemberRequest),
  });
  const { error, mutate, isLoading } = trpcClient.members.create.useMutation(
    handleUseMutationAlerts({
      successText: "El asociado ha sido creado!",
      callback: () => {
        context.members.invalidate();
      },
    })
  );

  const submitFunc = async (data: FormBecomeMemberRequest) => {
    console.log(data);
    /* mutate(data); */
  };
  return (
    <Container
      padding={"10px"}
      backgroundColor={backgroundColor}
      maxW={"800px"}
    >
      <div style={{ marginBottom: "10px" }}>
        {isOpen && (
          <Button
            rightIcon={<Icon boxSize={6} as={BiCheckboxMinus} />}
            color={"orange"}
            onClick={onToggle}
          >
            Disclaimer
          </Button>
        )}
        <ScaleFade initialScale={0.9} in={!isOpen}>
          <Box
            borderColor="orange"
            borderWidth="2px"
            borderRadius="8px"
            padding={"10px"}
            display={isOpen ? "none" : "flex"}
            flexDirection={"column"}
          >
            <Text fontSize={"lg"} color="orange">
              Atención
            </Text>
            <Text>
              Rellenar este formulario no implica ni garantiza que usted será
              automáticamente aprobado como socio de la organización. Su
              solicitud debe primeramente ser aprobada por el consejo. Al
              rellenar todo este formulario recibirá un correo confirmando la
              recepción del mismo por la organización, una vez que el consejo de
              la organización apruebe, rechace o tenga comentarios sobre su
              solicitud será notificado via correo electrónico con las siguiente
              instrucciones.
            </Text>
            <Button onClick={onToggle} alignSelf={"end"}>
              Entiendo
            </Button>
          </Box>
        </ScaleFade>
      </div>

      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <Text mb={"20px"} fontSize={"4xl"}>
          {" "}
          Formulario de asociación
        </Text>

        <SeedButton
          reset={reset}
          mock={() => mockBecomeMemberRequest(query.organizationId ?? "")}
        />
        <BecomeMemberForm
          control={control}
          errors={errors}
          setValue={setValue}
        />
        <Button
          marginTop={"20px"}
          isDisabled={isLoading || isSubmitting}
          type="submit"
          colorScheme="blue"
        >
          Enviar
        </Button>
      </form>
    </Container>
  );
};

export default BecomeMemberPage;
