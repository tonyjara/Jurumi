import type { GetServerSideProps } from 'next';
import MoneyRequestsPage from '../../../pageContainers/mod.requests/MoneyRequestsPage.mod.requests';

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
