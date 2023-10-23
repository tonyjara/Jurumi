import React, { useEffect, useState } from "react";
import {
  Flex,
  useDisclosure,
  Modal,
  Image,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  IconButton,
  Text,
  Button,
} from "@chakra-ui/react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { MdOutlineImageNotSupported } from "react-icons/md";
import type { searchableImage } from "@prisma/client";
import { IoChevronForwardOutline, IoChevronBackSharp } from "react-icons/io5";
import { BsImage, BsImages } from "react-icons/bs";
/* import { FiLink } from "react-icons/fi"; */

const SearchableImageModalCell = ({
  searchableImages,
}: {
  searchableImages: searchableImage[];
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [imageState, setImageState] = useState<{
    imageName: string;
    url: string;
    index: number;
  } | null>(null);
  /* const { onCopy, hasCopied } = useClipboard(imageState?.url ?? ""); */

  const handleClose = () => {
    setImageState(null);
    onClose();
  };

  useEffect(() => {
    if (!searchableImages[0] || !isOpen) return;
    setImageState({
      imageName: searchableImages[0]?.imageName,
      url: searchableImages[0]?.url,
      index: 0,
    });

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchableImages, isOpen]);

  const handleGoForward = () => {
    const index = (imageState?.index ?? 0) + 1;
    setImageState({
      imageName: searchableImages[index]?.imageName ?? "",
      url: searchableImages[index]?.url ?? "",
      index,
    });
  };

  const handleGoBackwards = () => {
    const index = (imageState?.index ?? 0) - 1;
    setImageState({
      imageName: searchableImages[index]?.imageName ?? "",
      url: searchableImages[index]?.url ?? "",
      index,
    });
  };

  const canGoBackwards = !!(imageState?.index && imageState.index > 0);
  const canGoForward = !!(
    imageState && imageState?.index < searchableImages.length - 1
  );

  return (
    <>
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          searchableImages.length && onOpen();
        }}
        aria-label="image icon"
        fontSize={"2xl"}
      >
        {searchableImages.length > 0 ? (
          searchableImages.length > 1 ? (
            <BsImages />
          ) : (
            <BsImage />
          )
        ) : (
          <MdOutlineImageNotSupported />
        )}
      </IconButton>

      <Modal size="xl" isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex gap="10px">
              {searchableImages.length > 1 && (
                <Flex gap={"5px"} alignItems="center">
                  <IconButton
                    onClick={handleGoBackwards}
                    isDisabled={!canGoBackwards}
                    aria-label="backwards arrow"
                  >
                    <IoChevronBackSharp />
                  </IconButton>
                  <Text>
                    {(imageState?.index ?? 0) + 1}/{searchableImages.length}
                  </Text>
                  <IconButton
                    onClick={handleGoForward}
                    isDisabled={!canGoForward}
                    aria-label="forward arrow"
                  >
                    <IoChevronForwardOutline />
                  </IconButton>
                </Flex>
              )}
              <Button as="a" target="_blank" download href={imageState?.url}>
                Descargar
              </Button>
              {/* <IconButton */}
              {/*   onClick={(e) => { */}
              {/*     e.stopPropagation(); */}
              {/*     onCopy(); */}
              {/*   }} */}
              {/*   aria-label="copy link button" */}
              {/* > */}
              {/*   <FiLink color={hasCopied ? "green" : undefined} /> */}
              {/* </IconButton> */}
            </Flex>
            <Text>Nombre: {imageState?.imageName ?? ""}</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {" "}
            <TransformWrapper>
              <TransformComponent>
                <Image alt="expandable image" src={imageState?.url ?? ""} />
              </TransformComponent>
            </TransformWrapper>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchableImageModalCell;
