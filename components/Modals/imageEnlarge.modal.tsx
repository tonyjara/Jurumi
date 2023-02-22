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
} from "@chakra-ui/react";

import {
    TransformWrapper,
    TransformComponent,
} from "@pronestor/react-zoom-pan-pinch";
import { trpcClient } from "@/lib/utils/trpcClient";
import { handleUseMutationAlerts } from "../Toasts & Alerts/MyToast";

const ImageEnlargeModal = ({
    url,
    imageName,
    isOpen,
    onClose,
    text,
    facturaNumber,
}: {
    url?: string;
    imageName?: string;
    facturaNumber?: string;
    text?: string;
    isOpen: boolean;
    onClose: () => void;
}) => {
    const [disableButton, setDisableButton] = useState(false);
    const { mutate } = trpcClient.gallery.scanImage.useMutation(
        handleUseMutationAlerts({
            successText: "Enviado al servidor 🤖 podria tardar un minuto 🕰️",
            callback: () => { },
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
                            </ButtonGroup>
                            <Text mb={"10px"} fontSize={"xl"}>
                                <span style={{ fontWeight: "bold" }}>Nombre:</span> {imageName}
                            </Text>
                            <Text mb={"10px"} fontSize={"xl"}>
                                <span style={{ fontWeight: "bold" }}>Número de factura:</span>
                                {facturaNumber}
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
