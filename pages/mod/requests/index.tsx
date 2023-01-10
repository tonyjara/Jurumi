import ModMoneyRequestsPage from '@/pageContainers/mod/requests/MoneyRequestsPage.mod.requests';
import type { GetServerSideProps } from 'next';

export default ModMoneyRequestsPage;

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
