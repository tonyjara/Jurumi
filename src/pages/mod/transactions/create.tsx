import type { GetServerSideProps } from 'next';
import CreateTransactionPage from '../../../pageContainers/mod.transactions/CreateTransactionPage.mod.transactions';

export default CreateTransactionPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const query = ctx.query as {
    moneyRequestId?: string;
    imbursementId?: string;
    expenseReturnId?: string;
  };

  if (query.moneyRequestId) {
    const data = await prisma?.moneyRequest.findUnique({
      where: { id: query.moneyRequestId },
      include: { transactions: { select: { transactionAmount: true } } },
    });
    if (!data) return { notFound: true };

    return {
      props: {
        moneyRequest: data,
      },
    };
  }

  return {
    notFound: true,
  };
};
