import { Button } from "@chakra-ui/react";
import writeXlsxFile from "write-excel-file";
import { Table } from "@tanstack/react-table";
import React from "react";
import { BsFillFileExcelFill } from "react-icons/bs";

const ExportTableToExcel = <T extends object>({
  table,
  rawValuesDictionary,
}: {
  table: Table<T>;
  rawValuesDictionary: any;
}) => {
  async function exportToExcel() {
    const headers = table.getFlatHeaders().map((header) => ({
      value: header.column.columnDef.header as string,
      fontWeight: "bold",
    })) as { value: string; fontWeight: string }[];

    const data: any = [headers, ...rawValuesDictionary({ table })];

    return await writeXlsxFile(data, { fileName: "asdf" });
  }
  return (
    <Button
      onClick={exportToExcel}
      rightIcon={<BsFillFileExcelFill />}
      size="sm"
    >
      Exportar
    </Button>
  );
};

export default ExportTableToExcel;
