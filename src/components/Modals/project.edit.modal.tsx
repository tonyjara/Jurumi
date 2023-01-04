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
import React, { useEffect } from 'react';
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

const EditProjectModal = ({
  isOpen,
  onClose,
  project,
}: {
  isOpen: boolean;
  onClose: () => void;
  project: FormProject;
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
  useEffect(() => {
    if (isOpen) {
      reset(project);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
  const handleOnClose = () => {
    reset(defaultProjectData);
    onClose();
  };

  const { error, mutate, isLoading } = trpcClient.project.edit.useMutation(
    handleUseMutationAlerts({
      successText: 'Su proyecto ha sido editado! ',
      callback: () => {
        handleOnClose();
        context.project.getMany.invalidate();
      },
    })
  );

  const submitFunc = async (data: FormProject) => {
    mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar un proyecto</ModalHeader>
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
              Editar
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

export default EditProjectModal;
