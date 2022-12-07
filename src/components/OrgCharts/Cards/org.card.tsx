import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Stack,
  StackDivider,
  Box,
  Container,
  ListItem,
  UnorderedList,
  Icon,
  Divider,
  HStack,
  IconButton,
  useDisclosure,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { MdOutlineAdd, MdOutlineDelete, MdOutlineEdit } from 'react-icons/md';
import { trpcClient } from '../../../lib/utils/trpcClient';
import CreateProjectModal from '../../Modals/project.create.modal';
import EditOrgModal from '../../Modals/org.edit.modal';
import { handleUseMutationAlerts } from '../../Toasts/MyToast';

const OrgCard = ({ displayName, id }: { displayName: string; id: string }) => {
  const context = trpcClient.useContext();
  const {
    isOpen: isProjectOpen,
    onOpen: onProjectOpen,
    onClose: onProjectClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const { mutate, isLoading } = trpcClient.org.deleteById.useMutation(
    handleUseMutationAlerts({
      successText: 'La organización ha sido eliminada! 💩',
      callback: () => {
        context.org.getMany.invalidate();
      },
    })
  );
  const deleteOrg = () => {
    mutate({ id });
  };
  const cardBackground = useColorModeValue('white', 'gray.700');
  return (
    <Container maxW={'280px'}>
      <Card backgroundColor={cardBackground}>
        <CardHeader>
          <Heading size="md">{displayName}</Heading>
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />}>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Resumen
              </Heading>
              <UnorderedList textAlign={'left'}>
                <ListItem>3 Cuentas bancarias</ListItem>
                <ListItem>5 Proyectos</ListItem>
                <ListItem>20 Desembolsos</ListItem>
                <ListItem>200 Transacciones</ListItem>
              </UnorderedList>
              <Divider mb={2} mt={2} />
              <HStack justifyContent={'end'}>
                <Button
                  onClick={onProjectOpen}
                  rightIcon={<Icon boxSize={6} as={MdOutlineAdd} />}
                  aria-label={'Add Org'}
                  size="sm"
                  alignSelf={'end'}
                >
                  Proyecto
                </Button>
                <IconButton
                  onClick={onEditOpen}
                  icon={<Icon boxSize={6} as={MdOutlineEdit} />}
                  aria-label={'Edit Org'}
                  size="sm"
                />
                <IconButton
                  icon={<Icon boxSize={6} as={MdOutlineDelete} />}
                  aria-label={'Delete Org'}
                  size="sm"
                  onClick={deleteOrg}
                  disabled={isLoading}
                />
              </HStack>
            </Box>
          </Stack>
        </CardBody>
      </Card>

      <EditOrgModal
        id={id}
        displayName={displayName}
        isOpen={isEditOpen}
        onClose={onEditClose}
      />
      <CreateProjectModal
        orgId={id}
        isOpen={isProjectOpen}
        onClose={onProjectClose}
      />
    </Container>
  );
};

export default OrgCard;
