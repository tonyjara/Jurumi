import CreateTransactionPage from '@/pageContainers/mod/transactions/CreateTransactionPage.mod.transactions';
import type { GetServerSideProps } from 'next';
import prisma from '@/server/db/client';
export default CreateTransactionPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const query = ctx.query as {
    moneyRequestId?: string;
    imbursementId?: string;
    expenseReturnId?: string;
  };

  if (query.moneyRequestId) {
    const data = await prisma.moneyRequest.findUnique({
      where: { id: query.moneyRequestId },
      include: {
        transactions: {
          select: { transactionAmount: true },
          where: { cancellationId: null, isCancellation: false },
        },
      },
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
