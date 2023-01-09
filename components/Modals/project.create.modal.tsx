import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { knownErrors } from '../../lib/dictionaries/knownErrors';

import { trpcClient } from '../../lib/utils/trpcClient';
import { handleUseMutationAlerts } from '../Toasts/MyToast';
import SeedButton from '../DevTools/SeedButton';
import { projectMock } from '../../__tests__/mocks/Mocks';
import ProjectForm from '../Forms/Project.form';
import type { FormProject } from '../../lib/validations/project.validate';
import {
  defaultProjectData,
  validateProject,
} from '../../lib/validations/project.validate';

const ProjectCreateModal = ({
  isOpen,
  onClose,
  orgId,
}: {
  isOpen: boolean;
  onClose: () => void;
  orgId: string;
}) => {
  const context = trpcClient.useContext();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormProject>({
    defaultValues: defaultProjectData,
    resolver: zodResolver(validateProject),
  });
  const handleOnClose = () => {
    reset(defaultProjectData);
    onClose();
  };

  const { error, mutate, isLoading } = trpcClient.project.create.useMutation(
    handleUseMutationAlerts({
      successText: 'Su proyecto ha sido creada! 🔥',
      callback: () => {
        handleOnClose();
        context.project.getMany.invalidate();
      },
    })
  );

  const submitFunc = async (data: FormProject) => {
    data.organizationId = orgId;
    mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear un proyecto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SeedButton reset={reset} mock={projectMock} />
            {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
            <ProjectForm control={control} errors={errors} />
          </ModalBody>

          <ModalFooter>
            <Button
              disabled={isLoading || isSubmitting}
              type="submit"
              colorScheme="blue"
              mr={3}
            >
              Guardar
            </Button>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default ProjectCreateModal;
