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

export interface IObjectKeys {
  [key: string]: any;
}
type NestedKeyOf<ObjectType extends IObjectKeys> = {
  [Key in keyof ObjectType &
    (string | number)]: ObjectType[Key] extends IObjectKeys
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export interface TableOptions {
  onClick: () => void;
  label: string;
}
export interface DynamicCellProps<T extends IObjectKeys> {
  objectKey: NestedKeyOf<T>;
  // objectKey: Extract<keyof T, string>;
  data: T;
  enumFunc?: (x: any) => string;
}

interface DynamicTableProps<T extends object> {
  title: string;
  subTitle?: string;
  headers: string[];
  rows?: T[];
  options?: TableOptions[]; // enables three dot menu
  searchBar?: React.ReactNode;
  loading?: boolean;
}

const DynamicTable = <T extends object>({
  title,
  headers,
  rows,
  options,
  subTitle,
  searchBar,
  loading,
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
            {searchBar}
          </Flex>
          <ThreeDotTableButton options={options} />
        </Flex>
      </CardHeader>
      <CardBody overflow={'auto'}>
        <Table size={['sm', 'md']} variant={'simple'}>
          <Thead>
            <Tr>
              {headers.map((label, idx: number) => {
                return <Th key={idx}>{label}</Th>;
              })}
            </Tr>
          </Thead>
          <Tbody>
            <>
              {!loading && rows}
              {(!rows || loading) && <SkeletonRows />}
            </>
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default DynamicTable;
