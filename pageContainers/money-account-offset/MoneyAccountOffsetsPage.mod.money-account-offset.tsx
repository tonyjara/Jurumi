import type { MoneyAccountOffset } from "@prisma/client";
import React from "react";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";

import { trpcClient } from "@/lib/utils/trpcClient";
import DynamicTable, {
  TableOptions,
} from "@/components/DynamicTables/DynamicTable";
import { modMoneyAccountOffsetColumn } from "./columns.mod.moneyAccountOffset";
import RowOptionsMoneyAccountOffset from "./rowOptions.mod.moneyAccountOffset";

export type MoneyAccountOffsetComplete = MoneyAccountOffset & {
  account: {
    displayName: string;
  };
  moneyAccount: {
    displayName: string;
  };
  transactions: {
    id: number;
  }[];
};

const MoneyaccountOffsetPage = () => {
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, globalFilter, pageSize, sorting, setGlobalFilter } =
    dynamicTableProps;

  const { data, isFetching, isLoading } =
    trpcClient.moneyAcc.getManyAccountOffsets.useQuery(
      { pageIndex, pageSize, sorting: globalFilter ? sorting : null },
      { keepPreviousData: globalFilter ? true : false }
    );
  const { data: count } = trpcClient.moneyAcc.countccountOffsets.useQuery();

  const rowOptionsFunction = (x: MoneyAccountOffsetComplete) => {
    return <RowOptionsMoneyAccountOffset x={x} />;
  };

  const tableOptions: TableOptions[] = [
    {
      onClick: () => setGlobalFilter(true),
      label: `${globalFilter ? "✅" : "❌"} Filtro global`,
    },
    {
      onClick: () => setGlobalFilter(false),
      label: `${!globalFilter ? "✅" : "❌"} Filtro local`,
    },
  ];

  return (
    <DynamicTable
      title={"Ajustes de cuentas"}
      columns={modMoneyAccountOffsetColumn({ pageIndex, pageSize })}
      loading={isFetching || isLoading}
      options={tableOptions}
      data={data ?? []}
      count={count ?? 0}
      colorRedKey={["wasCancelled"]}
      rowOptions={rowOptionsFunction}
      {...dynamicTableProps}
    />
  );
};

export default MoneyaccountOffsetPage;
