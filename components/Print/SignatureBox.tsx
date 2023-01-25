import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

const SignatureBox = ({ title }: { title: string }) => {
  const borderColor = useColorModeValue('gray.700', 'gray.300');

  return (
    <TableContainer
      borderColor={borderColor}
      borderWidth="1px"
      borderStyle={'solid'}
      borderRadius="8px"
      maxW="400px"
      mt={'10px'}
    >
      <Table colorScheme={borderColor}>
        <Tbody>
          <Tr>
            <Td fontWeight={'bold'}>{title}</Td>
            <Td></Td>
          </Tr>
          <Tr h="100px">
            <Td fontWeight={'bold'}>Firma:</Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td fontWeight={'bold'}>Fecha:</Td>
            <Td whiteSpace={'break-spaces'}></Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default SignatureBox;
