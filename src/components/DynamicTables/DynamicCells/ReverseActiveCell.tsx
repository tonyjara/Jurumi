import React from 'react';
import { Td } from '@chakra-ui/react';
import { MdCheckCircle, MdOutlineUnpublished } from 'react-icons/md';
import type { DynamicCellProps } from '../DynamicTable';

const ReverseActiveCell = <T extends object>(props: DynamicCellProps<T>) => {
  const { data, objectKey } = props;

  return (
    <Td>
      {!data[objectKey] && <MdCheckCircle color="green" />}
      {data[objectKey] && <MdOutlineUnpublished color="red" />}
    </Td>
  );
};

export default ReverseActiveCell;
