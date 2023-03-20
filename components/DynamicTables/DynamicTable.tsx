import {
  Card,
  CardHeader,
  chakra,
  Flex,
  HStack,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useRef } from 'react';
import SkeletonRows from './Utils/SkeletonRows';
import ThreeDotTableButton from './Utils/ThreeDotTableButton';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import type { ColumnDef, Header, SortingState } from '@tanstack/react-table';
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import { TbWorld } from 'react-icons/tb';
import { customScrollbar } from 'styles/CssUtils';
import TablePagination from './TablePagination';

export interface TableOptions {
  onClick: () => void;
  label: string;
}

interface DynamicTableProps<T extends object> {
  title?: string;
  headerComp?: React.ReactNode;
  subTitle?: string;
  options?: TableOptions[]; // enables three dot menu
  searchBar?: React.ReactNode;
  loading?: boolean;
  noHeader?: boolean;
  data?: T[];
  h?: string;
  columns?: ColumnDef<T, any>[];
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  count: number;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  globalFilter?: boolean;
  colorRedKey?: string[];
}

const DynamicTable = <T extends object>({
  title,
  options,
  subTitle,
  searchBar,
  loading,
  noHeader,
  // h,
  data,
  columns,
  pageIndex,
  setPageIndex,
  pageSize,
  setPageSize,
  count,
  sorting,
  setSorting,
  globalFilter,
  headerComp,
  colorRedKey,
}: DynamicTableProps<T>) => {
  const backgroundColor = useColorModeValue('white', 'gray.800');

  const table = useReactTable({
    columns: columns ?? [],
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: !globalFilter ? setSorting : undefined,
    getSortedRowModel: !globalFilter ? getSortedRowModel() : undefined,
    state: !globalFilter
      ? {
          sorting,
        }
      : undefined,
  });

  const handleToggleSorting = (header: Header<T, unknown>) => {
    if (!sorting.length) {
      setSorting([{ id: header.column.id, desc: true }]);
    }
    if (sorting[0]?.desc) {
      setSorting([{ id: header.column.id, desc: false }]);
    }
    if (sorting[0] && !sorting[0].desc) {
      setSorting([]);
    }
  };

  const redRowColor = useColorModeValue('red.700', 'red.300');
  const rowHoverColor = useColorModeValue('gray.100', 'gray.700');

  const cellRef = useRef(null);
  return (
    <Card
      // display={'flex'}
      w="100%"
      css={customScrollbar}
      overflow={'auto'}
      backgroundColor={backgroundColor}
    >
      {!noHeader && (
        <CardHeader>
          <Flex justifyContent={'space-between'}>
            {headerComp}
            <Flex flexDirection={'column'}>
              <Text fontWeight={'bold'} fontSize={{ base: '2xl', md: '3xl' }}>
                {title}
              </Text>
              <Text fontSize="md">{subTitle}</Text>
              {searchBar}
            </Flex>
            <HStack>
              <Tooltip
                placement="left"
                label="Cuando el filtro global esta activado, al presionar sobre la cabecera de las columnas los datos serán filtrados en toda la base de datos. De lo contrario serán ordenados solamente en la lista cargada actualmente."
              >
                {globalFilter ? (
                  <IconButton
                    colorScheme={'green'}
                    aria-label="global filter active"
                  >
                    <TbWorld style={{ width: '30px', height: '30px' }} />
                  </IconButton>
                ) : (
                  <IconButton
                    colorScheme={'red'}
                    aria-label="global filter inactive"
                  >
                    <TbWorld style={{ width: '30px', height: '30px' }} />
                  </IconButton>
                )}
              </Tooltip>
              <ThreeDotTableButton options={options} />
            </HStack>
          </Flex>
        </CardHeader>
      )}

      <Table
        css={customScrollbar}
        overflowX={'scroll'}
        size={['sm', 'md']}
        variant={'simple'}
        backgroundColor={backgroundColor}
      >
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                const meta: any = header.column.columnDef.meta;

                return (
                  <Th
                    cursor={
                      header.column.accessorFn?.length ? 'pointer' : undefined
                    }
                    key={header.id}
                    onClick={() => handleToggleSorting(header)}
                    isNumeric={meta?.isNumeric}
                  >
                    <Flex>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      <chakra.span pl="4">
                        {!globalFilter && header.column.getIsSorted() ? (
                          header.column.getIsSorted() === 'desc' ? (
                            <TriangleDownIcon aria-label="sorted descending" />
                          ) : (
                            <TriangleUpIcon aria-label="sorted ascending" />
                          )
                        ) : null}
                        {globalFilter &&
                        sorting[0] &&
                        sorting[0].id === header.column.id ? (
                          sorting[0]?.desc ? (
                            <TriangleDownIcon aria-label="sorted descending" />
                          ) : (
                            <TriangleUpIcon aria-label="sorted ascending" />
                          )
                        ) : null}
                      </chakra.span>
                    </Flex>
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {!loading &&
            data &&
            table?.getRowModel().rows.map((row) => (
              <Tr
                color={
                  //@ts-ignore
                  colorRedKey && colorRedKey.some((key) => !!row.original[key])
                    ? redRowColor
                    : undefined
                }
                key={row.id}
                /* _hover={{ backgroundColor: rowHoverColor, cursor: 'pointer' }} */
                /* onClick={() => console.log(row)} */
              >
                {row.getVisibleCells().map((cell) => {
                  // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                  const meta: any = cell.column.columnDef.meta;

                  return (
                    <Td ref={cellRef} key={cell.id} isNumeric={meta?.isNumeric}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  );
                })}
              </Tr>
            ))}
          {(!data || loading) && <SkeletonRows />}
        </Tbody>
      </Table>
      <TablePagination
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        pageSize={pageSize}
        setPageSize={setPageSize}
        count={count}
        data={data}
      />
    </Card>
  );
};

export default DynamicTable;
