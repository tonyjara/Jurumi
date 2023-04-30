import React, { useState } from "react";
import {
  Flex,
  Modal,
  Image,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Box,
  Text,
  ButtonGroup,
  Button,
  useClipboard,
} from "@chakra-ui/react";

import {
  TransformWrapper,
  TransformComponent,
} from "@pronestor/react-zoom-pan-pinch";
import { trpcClient } from "@/lib/utils/trpcClient";
import { handleUseMutationAlerts } from "../Toasts & Alerts/MyToast";
import type { searchableImage } from "@prisma/client";
import { decimalFormat } from "@/lib/utils/DecimalHelpers";
import { format } from "date-fns";
import ReplaceSearchableImage from "../AdminUtils/ReplaceSearchableImage";

const ImageEnlargeModal = ({
  isOpen,
  onClose,
  searchableImage,
}: {
  searchableImage: searchableImage;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { url, imageName, createdAt, facturaNumber, amount, currency, text } =
    searchableImage;
  const [disableButton, setDisableButton] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { onCopy, hasCopied } = useClipboard(url ?? "");

  const { mutate } = trpcClient.gallery.scanImage.useMutation(
    handleUseMutationAlerts({
      successText: "Enviado al servidor 🤖 podria tardar un minuto 🕰️",
      callback: () => {},
    })
  );

  const handleImageScan = async () => {
    if (!imageName) return;
    mutate({ imageName: imageName });

    setDisableButton(true);
    setTimeout(() => {
      setDisableButton(false);
    }, 20000);
  };

  const handelSaveChanges = () => {
    setEditMode(false);
  };

  return (
    <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDir={{ base: "column", md: "row" }}>
            <Box w={{ base: "100%", md: "50%" }}>
              <TransformWrapper>
                <TransformComponent>
                  <Image alt="expandable image" src={url} />
                </TransformComponent>
              </TransformWrapper>
            </Box>
            <Box
              w={{ base: "100%", md: "50%" }}
              p="20px"
              minW={{ base: "0px", md: "400px" }}
            >
              <ButtonGroup mb="20px">
                <Button isDisabled={disableButton} onClick={handleImageScan}>
                  Escanear
                </Button>
                {!editMode && (
                  <Button onClick={() => setEditMode(true)}>Editar</Button>
                )}
                {editMode && (
                  <Button onClick={handelSaveChanges}>Guardar</Button>
                )}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy();
                  }}
                >
                  {hasCopied ? "Copiado!" : "Copiar link"}
                </Button>
              </ButtonGroup>
              <ReplaceSearchableImage searchableImage={searchableImage} />
              <Text mb={"10px"} fontSize={"xl"}>
                <span style={{ fontWeight: "bold" }}>Fecha:</span> <br />
                {createdAt && format(createdAt, "dd/MM/yy hh:mm")}
              </Text>
              <Text mb={"10px"} fontSize={"xl"}>
                <span style={{ fontWeight: "bold" }}>Nombre:</span> <br />
                {imageName}
              </Text>
              <Text mb={"10px"} fontSize={"xl"}>
                <span style={{ fontWeight: "bold" }}>Número de factura:</span>
                <br />
                {facturaNumber}
              </Text>
              <Text mb={"10px"} fontSize={"xl"}>
                <span style={{ fontWeight: "bold" }}>Monto:</span>
                <br />
                {amount && currency && decimalFormat(amount, currency)}
              </Text>

              <Text mb={"10px"} fontSize={"xl"}>
                <span style={{ fontWeight: "bold" }}>Texto:</span> {text}
              </Text>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImageEnlargeModal;
