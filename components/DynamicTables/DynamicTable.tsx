import {
  Box,
  Card,
  CardHeader,
  chakra,
  Flex,
  Menu,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Portal,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import SkeletonRows from "./Utils/SkeletonRows";
import { CloseIcon, TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import type { ColumnDef, Header, SortingState } from "@tanstack/react-table";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { customScrollbar } from "styles/CssUtils";
import TablePagination from "./TablePagination";
import TableTitleMenu from "./Utils/TableTitleMenu";

export interface TableOptions {
  onClick: () => void;
  label: string;
}

export interface DynamicTableProps<T extends object> {
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
  rowOptions?: any;
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
  rowOptions,
}: DynamicTableProps<T>) => {
  const [menuData, setMenuData] = useState<{
    index: number | null;
    x: number;
    y: number;
  }>({ index: null, x: 0, y: 0 });

  const backgroundColor = useColorModeValue("white", "gray.800");

  const table = useReactTable({
    columns: columns ?? [],
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: !globalFilter ? setSorting : undefined,
    getSortedRowModel: !globalFilter ? getSortedRowModel() : undefined,
    state: { sorting },
    /* enableRowSelection: true, */
    /* onRowSelectionChange: setRowSelection, */
    /* state: !globalFilter */
    /*   ? { */
    /*       sorting, */
    /*       rowSelection, */
    /*     } */
    /*   : { rowSelection }, */
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

  const redRowColor = useColorModeValue("red.700", "red.300");
  const rowHoverColor = useColorModeValue("gray.100", "gray.700");

  const cellRef = useRef(null);

  return (
    <Card
      w="100%"
      css={customScrollbar}
      overflow={"auto"}
      backgroundColor={backgroundColor}
      maxH="calc(100vh - 80px)"
    >
      {!noHeader && (
        <CardHeader display="flex" w="100%" flexDirection="column">
          <Flex flexDirection={{ base: "column", md: "row" }} gap="10px">
            <Flex flexDirection={"column"}>
              <TableTitleMenu
                globalFilter={globalFilter}
                label={title}
                options={options}
              />

              {subTitle && (
                <Text as="em" py="10px" px="5px">
                  {subTitle}
                </Text>
              )}
            </Flex>
            {searchBar}
          </Flex>
          <Box alignSelf="start">{headerComp}</Box>
        </CardHeader>
      )}
      <Table
        css={customScrollbar}
        overflowX={"scroll"}
        size={["sm", "md"]}
        variant={"simple"}
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
                      header.column.accessorFn?.length ? "pointer" : undefined
                    }
                    key={header.id}
                    onClick={() => handleToggleSorting(header)}
                    isNumeric={meta?.isNumeric}
                    color={
                      globalFilter && header.id === "no-global-sort"
                        ? "red.300"
                        : undefined
                    }
                  >
                    <Flex>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      <chakra.span pl="4">
                        {!globalFilter && header.column.getIsSorted() ? (
                          header.column.getIsSorted() === "desc" ? (
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
            table?.getRowModel().rows.map((row, i) => (
              <Tr
                color={
                  //@ts-ignore
                  colorRedKey && colorRedKey.some((key) => !!row.original[key])
                    ? redRowColor
                    : undefined
                }
                key={row.id}
                _hover={{ backgroundColor: rowHoverColor, cursor: "pointer" }}
                onClick={(e) => {
                  // opens menu at click position with row data.
                  if (i === menuData?.index) {
                    return setMenuData({ ...menuData, index: null });
                  }
                  const handleX = () => {
                    const limit = innerWidth - 300;
                    if (e.pageX > limit) {
                      return innerWidth - 300;
                    }
                    return e.pageX;
                  };
                  const handleY = () => {
                    return e.pageY;
                  };

                  setMenuData({ index: i, x: handleX(), y: handleY() });
                }}
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
                {/* Invisible cell to open the menu */}
                <Td>
                  <Portal>
                    <Menu isOpen={menuData?.index === i}>
                      <MenuList
                        position={"absolute"}
                        top={menuData?.y}
                        left={menuData?.x}
                      >
                        <MenuGroup>
                          <MenuItem
                            onClick={() =>
                              setMenuData({ ...menuData, index: null })
                            }
                            icon={<CloseIcon />}
                          >
                            Cerrar menú
                          </MenuItem>
                        </MenuGroup>
                        <MenuDivider />
                        <MenuGroup>{rowOptions(row.original)}</MenuGroup>
                      </MenuList>
                    </Menu>
                  </Portal>
                </Td>
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
