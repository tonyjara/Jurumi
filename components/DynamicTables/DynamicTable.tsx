// Chakra imports
import {
  Card,
  CardHeader,
  chakra,
  Flex,
  HStack,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
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
import React from 'react';
import SkeletonRows from './Utils/SkeletonRows';
import ThreeDotTableButton from './Utils/ThreeDotTableButton';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from '@chakra-ui/icons';
import type { ColumnDef, Header, SortingState } from '@tanstack/react-table';
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import { TbWorld } from 'react-icons/tb';
import { customScrollbar } from 'styles/CssUtils';

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
  colorRedKey?: string;
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
  const nextPage = () => setPageIndex(pageIndex + 1);
  const previousPage = () => setPageIndex(pageIndex - 1);
  const canNextPage = data?.length === pageSize;
  const canPreviousPage = pageIndex > 0;
  const gotoPage = (x: number) => setPageIndex(x);
  const lastPage = Math.ceil(count / pageSize);

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

  return (
    <Card
      css={customScrollbar}
      overflow={'auto'}
      backgroundColor={backgroundColor}
    >
      {!noHeader && (
        <CardHeader>
          <Flex justifyContent={'space-between'}>
            {headerComp}
            <Flex flexDirection={'column'}>
              <Text fontSize="xl" fontWeight="bold">
                {title}
              </Text>
              <Text fontSize="md">{subTitle}</Text>
              {searchBar}
            </Flex>
            <HStack>
              <Tooltip label="Cuando el filtro global esta activado, al presionar sobre la cabecera de las columnas los datos serán filtrados en toda la base de datos. De lo contrario serán ordenados solamente en la lista cargada actualmente.">
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
        display={'block'}
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
                  colorRedKey && !!row.original[colorRedKey]
                    ? redRowColor
                    : undefined
                }
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => {
                  // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                  const meta: any = cell.column.columnDef.meta;
                  return (
                    <Td key={cell.id} isNumeric={meta?.isNumeric}>
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
      <Flex w={'100%'} justifyContent="space-between" m={4} alignItems="center">
        <Flex>
          <IconButton
            onClick={() => gotoPage(0)}
            isDisabled={!canPreviousPage}
            icon={<ArrowLeftIcon h={3} w={3} />}
            mr={4}
            aria-label={''}
          />

          <IconButton
            onClick={previousPage}
            isDisabled={!canPreviousPage}
            icon={<ChevronLeftIcon h={6} w={6} />}
            aria-label={''}
          />
        </Flex>

        <Flex alignItems="center">
          <Text whiteSpace={'nowrap'} mr={8}>
            Pag.{' '}
            <Text fontWeight="bold" as="span">
              {pageIndex + 1}
            </Text>{' '}
            de{' '}
            <Text fontWeight="bold" as="span">
              {lastPage}
            </Text>
          </Text>
          <Text whiteSpace={'nowrap'}>Ir a pag.:</Text>{' '}
          <NumberInput
            ml={2}
            mr={8}
            w={28}
            min={1}
            max={lastPage}
            onChange={(value) => {
              const page = value ? parseInt(value) - 1 : 0;
              gotoPage(page);
            }}
            defaultValue={pageIndex + 1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select
            w={32}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            // minW="130px"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Mostrar {pageSize}
              </option>
            ))}
          </Select>
        </Flex>

        <Flex>
          <IconButton
            onClick={nextPage}
            isDisabled={!canNextPage}
            icon={<ChevronRightIcon h={6} w={6} />}
            aria-label={''}
          />

          <IconButton
            onClick={() => {
              gotoPage(lastPage - 1);
            }}
            isDisabled={!canNextPage}
            icon={<ArrowRightIcon h={3} w={3} />}
            ml={4}
            aria-label={''}
          />
        </Flex>
      </Flex>
    </Card>
  );
};

export default DynamicTable;
