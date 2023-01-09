import TransactionsPage from '@/pageContainers/mod/transactions/TransactionsPage.mod.transactions';
import type { GetServerSideProps } from 'next';

export default TransactionsPage;

export interface TransactionsPageProps {
  transactionIds?: string[];
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const query = ctx.query as TransactionsPageProps;

  return {
    props: {
      query,
    },
  };
};
