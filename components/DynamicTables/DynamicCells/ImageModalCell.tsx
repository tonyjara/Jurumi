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
} from '@chakra-ui/react';
import { BsFillImageFill } from 'react-icons/bs';
import {
  TransformWrapper,
  TransformComponent,
} from '@pronestor/react-zoom-pan-pinch';

const ImageModalCell = ({
  url,
  imageName,
}: {
  url?: string;
  imageName?: string;
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Flex
        cursor={'pointer'}
        onClick={onOpen}
        alignItems={'center'}
        direction="column"
      >
        <Icon fontSize={'2xl'}>
          <BsFillImageFill />
        </Icon>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{imageName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {' '}
            <TransformWrapper>
              <TransformComponent>
                <Image alt="expandable image" src={url} />
              </TransformComponent>
            </TransformWrapper>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ImageModalCell;
