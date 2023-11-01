import type { MoneyAccountOffset } from "@prisma/client";
import React from "react";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";

import { trpcClient } from "@/lib/utils/trpcClient";
import DynamicTable, {
  RowOptionsType,
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
  const { pageIndex, pageSize, sorting } = dynamicTableProps;

  const { data, isFetching, isLoading } =
    trpcClient.moneyAcc.getManyAccountOffsets.useQuery({
      pageIndex,
      pageSize,
      sorting,
    });
  const { data: count } = trpcClient.moneyAcc.countccountOffsets.useQuery();

  const rowOptionsFunction: RowOptionsType = ({ x, setMenuData }) => {
    return <RowOptionsMoneyAccountOffset x={x} setMenuData={setMenuData} />;
  };

  return (
    <DynamicTable
      title={"Ajustes de cuentas"}
      columns={modMoneyAccountOffsetColumn({ pageIndex, pageSize })}
      loading={isFetching || isLoading}
      data={data ?? []}
      count={count ?? 0}
      colorRedKey={["wasCancelled"]}
      rowOptions={rowOptionsFunction}
      {...dynamicTableProps}
    />
  );
};

export default MoneyaccountOffsetPage;
