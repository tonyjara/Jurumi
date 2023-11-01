import { MenuItem } from "@chakra-ui/react";
import { CSVLink } from "react-csv";

export default function ExportToExcelMenuItem({ data }: { data: any[] }) {
  const fileName = `Jurumi-${new Date().toISOString()}.csv`;
  return (
    <MenuItem isDisabled={data.length === 0}>
      <CSVLink filename={fileName} data={data}>
        Exportar selección a Excel
      </CSVLink>
    </MenuItem>
  );
}
