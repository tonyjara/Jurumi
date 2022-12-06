import React from 'react';
import { Td } from '@chakra-ui/react';
import { MdCheckCircle, MdOutlineUnpublished } from 'react-icons/md';

const BooleanCell = ({ isActive }: { isActive: boolean }) => {
  return (
    <Td>
      {isActive && <MdCheckCircle color="green" />}
      {!isActive && <MdOutlineUnpublished color="red" />}
    </Td>
  );
};

export default BooleanCell;
