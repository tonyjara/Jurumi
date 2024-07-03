import { trpcClient } from "@/lib/utils/trpcClient";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
const WelcomeScreenModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const context = trpcClient.useContext();
  const { mutate } = trpcClient.preferences.acceptWelcomeScreen.useMutation({
    onSuccess: () => {
      context.preferences.invalidate();
      onClose();
    },
  });

  const handleOnClose = () => {
    mutate();
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize={"3xl"}>Bienvenido a Jurumi!</ModalHeader>

        <ModalBody>
          <Text>
            Estamos super contentos de que te sumes a la plataforma. Puedes
            encontrar ayuda y tutoriales en{" "}
            <Link target={"_blank"} href="http://docs.opades.org.py">
              <span
                style={{
                  fontSize: "20px",
                  color: "#007bff",
                  fontWeight: "bold",
                }}
              >
                este link
              </span>
              .
            </Link>
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            whiteSpace={"break-spaces"}
            p="30px"
            colorScheme="blue"
            mr={3}
            onClick={handleOnClose}
          >
            Prometo ver la hermosa documentación antes de preguntar a mis
            compañeros!
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WelcomeScreenModal;
