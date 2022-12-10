import type {
  Account,
  MoneyAccount,
  MoneyRequest,
  Transaction,
} from '@prisma/client';
import React, { useEffect, useState } from 'react';

import TableSearchbar from '../../components/DynamicTables/Utils/TableSearchbar';
import { trpcClient } from '../../lib/utils/trpcClient';
import type { TransactionsPageProps } from '../../pages/mod/transactions';
import TransactionsTable from './TransactionsTable';

export type TransactionComplete = Transaction & {
  moneyAccount: MoneyAccount;
  account: Account;
  moneyRequest: MoneyRequest | null;
};

const TransactionsPage = ({ query }: { query: TransactionsPageProps }) => {
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (query.transactionIds) {
      setSearchValue(String(query.transactionIds) ?? '');
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data } = trpcClient.transaction.getManyComplete.useQuery();
  const { data: findByIdData, isFetching } =
    trpcClient.transaction.findManyCompleteById.useQuery(
      { ids: searchValue.split(',').map(Number) },
      { enabled: searchValue.length > 0 }
    );

  const handleDataSource: () => TransactionComplete[] = () => {
    if (findByIdData?.length) return findByIdData;
    if (data) return data;
    return [];
  };

  return (
    <TransactionsTable
      data={handleDataSource()}
      loading={isFetching}
      searchBar={
        <TableSearchbar
          type="text"
          placeholder="Buscar por ID"
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          helperText="Separe con coma para buscar varios."
        />
      }
    />
  );
};

export default TransactionsPage;
