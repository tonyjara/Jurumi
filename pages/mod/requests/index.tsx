import MoneyRequestsPage from '@/pageContainers/home/requests/HomeRequestsPage.home.requests';
import type { GetServerSideProps } from 'next';

export default MoneyRequestsPage;

export interface MoneyRequestsPageProps {
  moneyRequestId?: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const query = ctx.query as MoneyRequestsPageProps;

  return {
    props: {
      query,
    },
  };
};
