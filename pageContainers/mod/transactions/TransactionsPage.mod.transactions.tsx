import type { Prisma } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";

import TableSearchbar from "@/components/DynamicTables/Utils/TableSearchbar";
import { trpcClient } from "@/lib/utils/trpcClient";
import type { TransactionsPageProps } from "pages/mod/transactions";
import TransactionsTable from "./TransactionsTable";
import { TransactionComplete } from "./transactions.types";

const TransactionsPage = ({ query }: { query: TransactionsPageProps }) => {
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("id");
  const [whereFilterList, setWhereFilterList] = useState<
    Prisma.TransactionScalarWhereInput[]
  >([]);
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, pageSize, sorting } = dynamicTableProps;

  useEffect(() => {
    if (query.transactionIds) {
      setSearchValue(String(query.transactionIds) ?? "");
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    data,
    isLoading: isLoaingTxs,
    isFetching: isFetchingTxs,
  } = trpcClient.transaction.getManyComplete.useQuery({
    whereFilterList,
    pageIndex,
    pageSize,
    sorting,
  });
  const { data: count } = trpcClient.transaction.count.useQuery({
    whereFilterList,
  });
  const { data: findByIdData, isFetching } =
    trpcClient.transaction.findManyCompleteById.useQuery(
      { ids: searchValue.split(",").map(Number) },
      { enabled: searchValue.length > 0 },
    );

  const handleDataSource: () => TransactionComplete[] = () => {
    if (findByIdData?.length) return findByIdData;
    if (data) return data;
    return [];
  };

  const loading = isFetchingTxs || isLoaingTxs || isFetching;

  return (
    <TransactionsTable
      data={handleDataSource()}
      whereFilterList={whereFilterList}
      setWhereFilterList={setWhereFilterList}
      loading={loading}
      count={count}
      dynamicTableProps={dynamicTableProps}
      searchBar={
        <TableSearchbar
          type="text"
          placeholder="Buscar por ID"
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          helperText="Separe con coma para buscar varios."
        />
      }
    />
  );
};

export default TransactionsPage;
