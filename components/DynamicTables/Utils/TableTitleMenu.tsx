import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Text,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import type { TableOptions } from "../DynamicTable";
import { BiWorld } from "react-icons/bi";
import { BsFillFileExcelFill } from "react-icons/bs";
import { Table } from "@tanstack/react-table";
import writeXlsxFile from "write-excel-file";

const TableTitleMenu = ({
  options,
  label,
  table,
  globalFilter,
}: {
  options?: TableOptions[];
  label: string | undefined;
  globalFilter?: boolean;
  table: Table<any>;
}) => {
  async function exportToExcel() {
    /* const HEADER_ROW = table */
    /*   .getFlatHeaders() */
    /*   .map((header) => ({ */
    /*     value: header.column.columnDef.header, */
    /*     fontWeight: "bold", */
    /*   })); */
    /* console.log(HEADER_ROW); */
    /**/
    /* const DATA_ROW_1 = [ */
    /*   // "Name" */
    /*   { */
    /*     type: String, */
    /*     value: "John Smith", */
    /*   }, */
    /**/
    /*   // "Date of Birth" */
    /*   { */
    /*     type: Date, */
    /*     value: new Date(), */
    /*     format: "mm/dd/yyyy", */
    /*   }, */
    /**/
    /*   // "Cost" */
    /*   { */
    /*     type: Number, */
    /*     value: 1800, */
    /*   }, */
    /**/
    /*   // "Paid" */
    /*   { */
    /*     type: Boolean, */
    /*     value: true, */
    /*   }, */
    /* ]; */
    /**/
    /* const data = [HEADER_ROW, DATA_ROW_1]; */
    /**/
    /* return await writeXlsxFile(data, { fileName: "asdf" }); */
  }
  return (
    <Flex gap="10px" alignItems={"center"}>
      {options?.length && (
        <Menu>
          <MenuButton
            fontSize={{ base: "2xl", md: "3xl" }}
            as={Button}
            rightIcon={<ChevronDownIcon />}
            alignItems="center"
            flexDir={"row"}
            display="flex"
            minW="250px"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {globalFilter && <BiWorld color="green" />}
              {label}
            </div>
          </MenuButton>
          <MenuList>
            {options.map((x) => (
              <MenuItem key={x.label} onClick={x.onClick}>
                {x.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      )}
      {!options?.length && (
        <Text fontSize={{ base: "2xl", md: "3xl" }}>{label}</Text>
      )}
      {/* <Button */}
      {/*   onClick={exportToExcel} */}
      {/*   rightIcon={<BsFillFileExcelFill />} */}
      {/*   size="sm" */}
      {/* > */}
      {/*   Exportar */}
      {/* </Button> */}
    </Flex>
  );
};

export default TableTitleMenu;
