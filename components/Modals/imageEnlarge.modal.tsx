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
import EditSearchableImageForm from "../Forms/SearchableImage.edit.form";

const ImageEnlargeModal = ({
  isOpen,
  onClose,
  searchableImage,
}: {
  searchableImage: searchableImage;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [disableButton, setDisableButton] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { onCopy, hasCopied } = useClipboard(searchableImage.url ?? "");

  const { mutate } = trpcClient.gallery.scanImage.useMutation(
    handleUseMutationAlerts({
      successText: "Enviado al servidor 🤖 podria tardar un minuto 🕰️",
      callback: () => {},
    })
  );
  const { data: fetchedSearchableImage } =
    trpcClient.searchableImage.getById.useQuery({ id: searchableImage.id });

  const handleImageScan = async () => {
    if (!searchableImage.imageName) return;
    mutate({ imageName: searchableImage.imageName });

    setDisableButton(true);
    setTimeout(() => {
      setDisableButton(false);
    }, 20000);
  };

  const handleModalClose = () => {
    setEditMode(false);
    onClose();
  };

  return (
    <Modal size="5xl" isOpen={isOpen} onClose={handleModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDir={{ base: "column", md: "row" }}>
            <Box w={{ base: "100%", md: "50%" }}>
              <TransformWrapper>
                <TransformComponent>
                  <Image alt="expandable image" src={searchableImage.url} />
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
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy();
                  }}
                >
                  {hasCopied ? "Copiado!" : "Copiar link"}
                </Button>
                {!editMode && (
                  <Button onClick={() => setEditMode(true)}>Editar</Button>
                )}
              </ButtonGroup>
              {!editMode && fetchedSearchableImage && (
                <ReplaceSearchableImage
                  searchableImage={fetchedSearchableImage}
                />
              )}
              {!editMode && (
                <div>
                  <Text my={"10px"} fontSize={"xl"}>
                    <span style={{ fontWeight: "bold" }}>Fecha:</span> <br />
                    {searchableImage.createdAt &&
                      format(searchableImage.createdAt, "dd/MM/yy hh:mm")}
                  </Text>
                  <Text mb={"10px"} fontSize={"xl"}>
                    <span style={{ fontWeight: "bold" }}>Nombre:</span> <br />
                    {searchableImage.imageName}
                  </Text>
                  <Text mb={"10px"} fontSize={"xl"}>
                    <span style={{ fontWeight: "bold" }}>
                      Número de factura:
                    </span>
                    <br />
                    {fetchedSearchableImage?.facturaNumber}
                  </Text>
                  <Text mb={"10px"} fontSize={"xl"}>
                    <span style={{ fontWeight: "bold" }}>Monto:</span>
                    <br />
                    {fetchedSearchableImage &&
                      decimalFormat(
                        fetchedSearchableImage.amount,
                        fetchedSearchableImage.currency
                      )}
                  </Text>

                  <Text mb={"10px"} fontSize={"xl"}>
                    <span style={{ fontWeight: "bold" }}>Texto:</span>{" "}
                    {fetchedSearchableImage?.text}
                  </Text>
                </div>
              )}
              {editMode && fetchedSearchableImage && (
                <EditSearchableImageForm
                  setEditMode={setEditMode}
                  searchableImage={fetchedSearchableImage}
                />
              )}
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImageEnlargeModal;
