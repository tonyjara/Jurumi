import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Box,
  Container,
  Icon,
  Divider,
  HStack,
  IconButton,
  useDisclosure,
  VStack,
  Button,
} from '@chakra-ui/react';
import React from 'react';
import { MdOutlineAdd, MdOutlineDelete, MdOutlineEdit } from 'react-icons/md';
import { trpcClient } from '../../../lib/utils/trpcClient';
import { handleUseMutationAlerts } from '../../Toasts/MyToast';
import type { Project } from '@prisma/client';
import { decimalFormat } from '../../../lib/utils/TranslatedEnums';
import EditProjectModal from '../../Modals/project.edit.modal';
import CreateDisbursementModal from '../../Modals/MoneyRequest.create.modal';

const ProjectCard = (project: Project) => {
  const context = trpcClient.useContext();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDisbursementOpen,
    onOpen: onDisbursementOpen,
    onClose: onDisbursmeentClose,
  } = useDisclosure();

  const { mutate, isLoading } = trpcClient.project.deleteById.useMutation(
    handleUseMutationAlerts({
      successText: 'El proyecto ha sido eliminado!',
      callback: () => {
        context.project.getMany.invalidate();
      },
    })
  );
  const handleDelete = () => {
    mutate({ id: project.id });
  };

  return (
    <Container maxW={'280px'}>
      <Card>
        <CardHeader pb={0}>
          <Heading size="md">Proyecto: {project.displayName}</Heading>
        </CardHeader>

        <CardBody>
          <Box>
            <Heading whiteSpace={'nowrap'} size="md">
              Monto asignado: <br />
              {/* {decimalFormat(
                project.assignedMoney,
                project.assignedMoneyCurrency
              )} */}
            </Heading>
            <VStack whiteSpace={'nowrap'} textAlign={'left'} spacing={0}>
              {/* <Text>Titular: {bankAcc.ownerName}</Text> */}
            </VStack>
            <Divider mb={2} mt={2} />
            <HStack justifyContent={'end'}>
              <Button
                onClick={onDisbursementOpen}
                rightIcon={<Icon boxSize={6} as={MdOutlineAdd} />}
                aria-label={'Add Disbursement'}
                size="sm"
                // alignSelf={'end'}
              >
                Desembolso
              </Button>
              <IconButton
                onClick={onEditOpen}
                icon={<Icon boxSize={6} as={MdOutlineEdit} />}
                aria-label={'Edit project'}
                size="sm"
              />
              <IconButton
                icon={<Icon boxSize={6} as={MdOutlineDelete} />}
                aria-label={'Delete project'}
                size="sm"
                onClick={handleDelete}
                disabled={isLoading}
              />
            </HStack>
          </Box>
        </CardBody>
      </Card>

      <EditProjectModal
        project={project}
        isOpen={isEditOpen}
        onClose={onEditClose}
      />
      <CreateDisbursementModal
        projectId={project.id}
        isOpen={isDisbursementOpen}
        onClose={onDisbursmeentClose}
      />
    </Container>
  );
};

export default ProjectCard;
