import React from 'react';
import { Td } from '@chakra-ui/react';
import { MdCheckCircle, MdOutlineUnpublished } from 'react-icons/md';
import type { DynamicCellProps } from '../DynamicTable';

const ActiveCell = <T extends object>(props: DynamicCellProps<T>) => {
  const { data, objectKey } = props;

  return (
    <Td>
      {objectKey && data[objectKey] && <MdCheckCircle color="green" />}
      {objectKey && !data[objectKey] && <MdOutlineUnpublished color="red" />}
    </Td>
  );
};

export default ActiveCell;
