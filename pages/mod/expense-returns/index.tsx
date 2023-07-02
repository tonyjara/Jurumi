import ModExpenseReturnsPage from "@/pageContainers/mod/expense-returns/ModExpenseReturnsPage.mod.expense-returns";
import { GetServerSideProps } from "next";

export default ModExpenseReturnsPage;

export interface ExpenseReturnsPageProps {
  expenseReturnsIds?: string[];
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const query = ctx.query as ExpenseReturnsPageProps;

  return {
    props: {
      query,
    },
  };
};
