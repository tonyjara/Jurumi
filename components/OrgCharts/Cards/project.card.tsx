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
  Text,
  List,
  ListItem,
} from '@chakra-ui/react';
import React from 'react';
import { MdOutlineAdd, MdOutlineDelete, MdOutlineEdit } from 'react-icons/md';
import { trpcClient } from '../../../lib/utils/trpcClient';
import { handleUseMutationAlerts } from '../../Toasts/MyToast';
import type { CostCategory, Project, ProjectStage } from '@prisma/client';
import EditProjectModal from '../../Modals/project.edit.modal';
import CreateMoneyRequestModal from '../../Modals/MoneyRequest.create.modal';
import { addDecimals, decimalFormat } from '../../../lib/utils/DecimalHelpers';

const ProjectCard = (
  project: Project & {
    costCategories: CostCategory[];
    projectStages: ProjectStage[];
  }
) => {
  const context = trpcClient.useContext();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isMoneyRequestOpen,
    onOpen: onMoneyRequestOpen,
    onClose: onMoneyRequestClose,
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
              Monto asignado:
              <br />
              {addDecimals(project.costCategories, 'openingBalance')}
            </Heading>
            <Text>Lineas Presupuestarias:</Text>
            <List>
              {project.costCategories.map((x) => (
                <ListItem key={x.id}>
                  {x.displayName}{' '}
                  {decimalFormat(
                    x.openingBalance.sub(x.executedAmount),
                    x.currency
                  )}
                </ListItem>
              ))}
            </List>
            <VStack
              whiteSpace={'nowrap'}
              textAlign={'left'}
              spacing={0}
            ></VStack>
            <Divider mb={2} mt={2} />
            <HStack justifyContent={'end'}>
              <Button
                onClick={onMoneyRequestOpen}
                rightIcon={<Icon boxSize={6} as={MdOutlineAdd} />}
                aria-label={'Add MoneyRequest'}
                size="sm"
              >
                Solicitud
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
      <CreateMoneyRequestModal
        projectId={project.id}
        orgId={project.organizationId}
        isOpen={isMoneyRequestOpen}
        onClose={onMoneyRequestClose}
      />
    </Container>
  );
};

export default ProjectCard;
