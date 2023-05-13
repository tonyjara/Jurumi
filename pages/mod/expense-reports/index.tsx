import ModExpenseReportsPage from "@/pageContainers/mod/expense-reports/ModExpenseReportsPage.mod.expense-reports";
import { GetServerSideProps } from "next";

export default ModExpenseReportsPage;

export interface ExpenseReportsPageProps {
  expenseReportsIds?: string[];
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const query = ctx.query as ExpenseReportsPageProps;

  return {
    props: {
      query,
    },
  };
};
