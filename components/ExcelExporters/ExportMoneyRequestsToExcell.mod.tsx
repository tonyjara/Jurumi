import { Button } from "@chakra-ui/react";
import writeXlsxFile, { SheetData } from "write-excel-file";
import { SortingState, Table } from "@tanstack/react-table";
import React from "react";
import { FaRegFileExcel } from "react-icons/fa";
import { format } from "date-fns";
import { trpcClient } from "@/lib/utils/trpcClient";
import { rawValuesModMoneyRequestsUnpaginated } from "@/pageContainers/mod/requests/rawValues.mod.MoneyRequests";
import { Prisma } from "@prisma/client";
import { MoneyRequestComplete } from "@/pageContainers/mod/requests/mod.requests.types";
import { handleUseMutationAlerts } from "../Toasts & Alerts/MyToast";

const ExportMoneyRequestsToExcell = <T extends object>({
  whereFilterList,
  extraFilters,
  sorting,
  table,
}: {
  sorting: SortingState;
  extraFilters: string[];
  whereFilterList: Prisma.MoneyRequestScalarWhereInput[];
  table: Table<T>;
}) => {
  async function exportToExcel(requests: MoneyRequestComplete[]) {
    try {
      const headers = table.getFlatHeaders().map((header) => ({
        value: header.column.columnDef.header as string,
        fontWeight: "bold",
      })) as { value: string; fontWeight: string }[];

      const values = rawValuesModMoneyRequestsUnpaginated({
        table,
        data: requests,
      });
      const columns = values.map((x: any) => ({
        width: x.width ?? 15,
      }));

      const data: SheetData[] = [headers, ...values] as any;

      return await writeXlsxFile(data, {
        columns,
        fileName: `Jurumi ${format(new Date(), "dd/MM/yyy")}`,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const { mutate: getUnPaginatedMoneyRequests } =
    trpcClient.moneyRequest.getManyCompleteUnpaginated.useMutation(
      handleUseMutationAlerts({
        successText: "Datos exportados exitosamente",
        callback: (data) => {
          exportToExcel(data);
        },
      }),
    );

  const handleGetUnPaginatedMoneyRequests = () => {
    return getUnPaginatedMoneyRequests({
      extraFilters,
      sorting: sorting,
      whereFilterList,
    });
  };

  return (
    <Button
      onClick={handleGetUnPaginatedMoneyRequests}
      rightIcon={<FaRegFileExcel />}
    >
      Exportar todo
    </Button>
  );
};

export default ExportMoneyRequestsToExcell;
