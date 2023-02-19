import React from 'react';
import {
  Flex,
  useDisclosure,
  Modal,
  Icon,
  Image,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Box,
  Text,
} from '@chakra-ui/react';

import {
  TransformWrapper,
  TransformComponent,
} from '@pronestor/react-zoom-pan-pinch';
import { MdOutlineImageNotSupported, MdOutlineImage } from 'react-icons/md';

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
  return (
    <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDir={{ base: 'column', md: 'row' }}>
            <TransformWrapper>
              <TransformComponent>
                <Image alt="expandable image" src={url} />
              </TransformComponent>
            </TransformWrapper>
            <Box p="20px" minW={{ base: '0px', md: '400px' }}>
              <Text mb={'10px'} fontSize={'xl'}>
                Nombre: {imageName}
              </Text>
              <Text mb={'10px'} fontSize={'xl'}>
                Número de factura: {facturaNumber}
              </Text>
              <Text mb={'10px'} fontSize={'xl'}>
                Texto: {text}
              </Text>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImageEnlargeModal;
