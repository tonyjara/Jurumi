import { CloseIcon, DeleteIcon, Search2Icon } from '@chakra-ui/icons';
import {
  Input,
  InputGroup,
  InputRightElement,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import type { ProjectComplete } from './SelectProject.mod.projects';

interface props {
  project?: ProjectComplete | null;
}

const ProjectMembers = ({ project }: props) => {
  const [searchValue, setSearchValue] = useState('');
  const hasLength = !!searchValue.length;

  return (
    <div>
      {!project && <Text>Favor seleccione un proyecto.</Text>}

      {project && (
        <>
          <InputGroup flexDir={'column'}>
            <Input
              value={searchValue}
              onChange={(x) => setSearchValue(x.target.value)}
              variant={'flushed'}
              placeholder={'placeholder'}
            />
            <InputRightElement
              onClick={() => hasLength && setSearchValue('')}
              cursor={hasLength ? 'pointer' : 'auto'}
            >
              {hasLength ? <CloseIcon /> : <Search2Icon />}
            </InputRightElement>
            <Text color={'gray.500'}>{'helperText'}</Text>
          </InputGroup>
          <TableContainer>
            <Table variant="simple">
              {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
              <Thead>
                <Tr>
                  <Th>Nombre</Th>
                  <Th>Correo</Th>
                  <Th>Eliminar</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>inches</Td>
                  <Td>millimetres (mm)</Td>
                  <Td>
                    <DeleteIcon />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default ProjectMembers;
