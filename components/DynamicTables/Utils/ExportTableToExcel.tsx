import { Button } from "@chakra-ui/react";
import writeXlsxFile, { SheetData } from "write-excel-file";
import { Table } from "@tanstack/react-table";
import React from "react";
import { FaRegFileExcel } from "react-icons/fa";
import { format } from "date-fns";
//This component takes a list of headers and a list of data and exports it to an excel file,
// Search for any file starting with rawValues for examples
// Dynamictables takes a prop called rawValuesDictionary which is a function that takes a table and returns a list of data

// Dates should always have format

const ExportTableToExcel = <T extends object>({
  table,
  rawValuesDictionary,
}: {
  table: Table<T>;
  rawValuesDictionary: any;
}) => {
  async function exportToExcel() {
    try {
      const headers = table.getFlatHeaders().map((header) => ({
        value: header.column.columnDef.header as string,
        fontWeight: "bold",
      })) as { value: string; fontWeight: string }[];
      const values = rawValuesDictionary({ table });
      const columns = values.map((x: any) => ({
        width: x.width ?? 15,
      }));

      const data: SheetData[] = [headers, ...values];

      return await writeXlsxFile(data, {
        columns,
        fileName: `Jurumi ${format(new Date(), "dd/MM/yyy")}`,
      });
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Button onClick={exportToExcel} rightIcon={<FaRegFileExcel />}>
      Exportar
    </Button>
  );
};

export default ExportTableToExcel;
