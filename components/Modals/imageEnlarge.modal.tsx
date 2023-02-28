import React, { useState } from 'react';
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
  Input,
  IconButton,
} from '@chakra-ui/react';

import {
  TransformWrapper,
  TransformComponent,
} from '@pronestor/react-zoom-pan-pinch';
import { trpcClient } from '@/lib/utils/trpcClient';
import { handleUseMutationAlerts } from '../Toasts & Alerts/MyToast';
import { EditIcon } from '@chakra-ui/icons';
import type { FormOrganization } from '@/lib/validations/org.validate';
import {
  defaultOrgData,
  validateOrganization,
} from '@/lib/validations/org.validate';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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
  const [editMode, setEditMode] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormOrganization>({
    defaultValues: defaultOrgData,
    resolver: zodResolver(validateOrganization),
  });

  const { mutate } = trpcClient.gallery.scanImage.useMutation(
    handleUseMutationAlerts({
      successText: 'Enviado al servidor 🤖 podria tardar un minuto 🕰️',
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
          <Flex flexDir={{ base: 'column', md: 'row' }}>
            <Box w={{ base: '100%', md: '50%' }}>
              <TransformWrapper>
                <TransformComponent>
                  <Image alt="expandable image" src={url} />
                </TransformComponent>
              </TransformWrapper>
            </Box>
            <Box
              w={{ base: '100%', md: '50%' }}
              p="20px"
              minW={{ base: '0px', md: '400px' }}
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
              </ButtonGroup>
              <Text mb={'10px'} fontSize={'xl'}>
                <span style={{ fontWeight: 'bold' }}>Nombre:</span> <br />
                {imageName}
              </Text>
              <Text mb={'10px'} fontSize={'xl'}>
                <span style={{ fontWeight: 'bold' }}>Número de factura:</span>
                <br />
                {facturaNumber}
              </Text>
              <Text mb={'10px'} fontSize={'xl'}>
                <span style={{ fontWeight: 'bold' }}>Texto:</span> {text}
              </Text>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImageEnlargeModal;
