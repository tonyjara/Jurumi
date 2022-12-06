// Chakra imports
import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import SkeletonRows from './Utils/SkeletonRows';
import ThreeDotTableButton from './Utils/ThreeDotTableButton';

export interface TableOptions {
  onClick: () => void;
  label: string;
}
export interface DynamicCellHeaders {
  label: string;
}

export interface DynamicCellProps<T extends object> {
  objectKey: keyof T;
  data: T;
}

interface DynamicTableProps<T extends object> {
  title: string;
  subTitle?: string;
  headers: DynamicCellHeaders[];
  rows?: T[];
  options?: TableOptions[]; // enables three dot menu
}

const DynamicTable = <T extends object>({
  title,
  headers,
  rows,
  options,
  subTitle,
}: DynamicTableProps<T>) => {
  const backgroundColor = useColorModeValue('white', 'gray.800');
  return (
    <Card backgroundColor={backgroundColor}>
      <CardHeader>
        <Flex justifyContent={'space-between'}>
          <Flex flexDirection={'column'}>
            <Text fontSize="xl" fontWeight="bold">
              {title}
            </Text>
            <Text fontSize="md">{subTitle}</Text>
          </Flex>
          <ThreeDotTableButton options={options} />
        </Flex>
      </CardHeader>
      <CardBody overflow={'auto'}>
        <Table size={['sm', 'md']} variant={'simple'}>
          <Thead>
            <Tr>
              {headers.map((header, idx: number) => {
                return <Th key={idx}>{header.label}</Th>;
              })}
            </Tr>
          </Thead>
          <Tbody>
            <>
              {rows}
              {!rows && <SkeletonRows />}
            </>
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default DynamicTable;
