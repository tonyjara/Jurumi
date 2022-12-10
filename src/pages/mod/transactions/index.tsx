import type { GetServerSideProps } from 'next';
import TransactionsPage from '../../../pageContainers/mod.transactions/TransactionsPage.mod.transactions';

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
