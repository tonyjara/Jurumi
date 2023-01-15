import SkeletonRows from '@/components/DynamicTables/Utils/SkeletonRows';
import { handleUseMutationAlerts } from '@/components/Toasts/MyToast';
import useDebounce from '@/lib/hooks/useDebounce';
import { trpcClient } from '@/lib/utils/trpcClient';
import { AddIcon, CloseIcon, DeleteIcon, Search2Icon } from '@chakra-ui/icons';
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import type { ProjectComplete } from './ProjectsPage.mod.projects';

interface props {
  project?: ProjectComplete | null;
}

const ProjectMembers = ({ project }: props) => {
  const context = trpcClient.useContext();
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const hasLength = !!searchValue.length;

  //Full text search of the users ruc inside DB.
  const { data: foundAccounts, isFetching: isFetchingFindData } =
    trpcClient.account.findByEmail.useQuery(
      { email: debouncedSearchValue },
      {
        refetchOnWindowFocus: false,
        enabled: debouncedSearchValue.length > 3,
      }
    );

  const { mutate: addUserToProject } =
    trpcClient.project.addAccountToProject.useMutation(
      handleUseMutationAlerts({
        successText: 'Se ha agregado el usuario al proyecto!',
        callback: () => {
          setSearchValue('');
          context.account.invalidate();
          context.project.invalidate();
        },
      })
    );
  const { mutate: removeAccountFromProject } =
    trpcClient.project.removeAccountFromProject.useMutation(
      handleUseMutationAlerts({
        successText: 'Se ha eliminado el usuario al proyecto!',
        callback: () => {
          context.account.invalidate();
          context.project.invalidate();
        },
      })
    );

  return (
    <div>
      {!project && <Text>Favor seleccione un proyecto.</Text>}

      {project && (
        <>
          <InputGroup mb={'20px'} maxW={'250px'} flexDir={'column'}>
            <Input
              value={searchValue}
              onChange={(x) => setSearchValue(x.target.value)}
              variant={'flushed'}
              placeholder={'Busque por correo electrónico.'}
            />
            <InputRightElement
              onClick={() => hasLength && setSearchValue('')}
              cursor={hasLength ? 'pointer' : 'auto'}
            >
              {hasLength ? <CloseIcon /> : <Search2Icon />}
            </InputRightElement>
            <Text color={'gray.500'}>
              {'Busque entre los usuarios para invitar al proyecto.'}
            </Text>
          </InputGroup>
          <TableContainer>
            <Table variant="simple">
              <TableCaption color={'gray.500'}>
                Los administradores o moderadores no necesitan ser miembros de
                proyectos.
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>Nombre</Th>
                  <Th>Correo</Th>
                  <Th>{foundAccounts?.length ? 'Agregar' : 'Eliminar'}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {!isFetchingFindData && foundAccounts
                  ? foundAccounts.map((foundUser) => (
                      <Tr key={foundUser.id}>
                        <Td>{foundUser.displayName}</Td>
                        <Td>{foundUser.email}</Td>
                        <Td>
                          <IconButton
                            onClick={() =>
                              addUserToProject({
                                accountId: foundUser.id,
                                projectId: project.id,
                              })
                            }
                            aria-label="Add user to group"
                          >
                            <AddIcon />
                          </IconButton>
                        </Td>
                      </Tr>
                    ))
                  : project.allowedUsers.map((user) => (
                      <Tr key={user.id}>
                        <Td>{user.displayName}</Td>
                        <Td>{user.email}</Td>
                        <Td>
                          <IconButton
                            onClick={() =>
                              removeAccountFromProject({
                                accountId: user.id,
                                projectId: project.id,
                              })
                            }
                            aria-label="Remove user to group"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Td>
                      </Tr>
                    ))}
                {isFetchingFindData && <SkeletonRows />}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default ProjectMembers;
