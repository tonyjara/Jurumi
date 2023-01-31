/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../initTrpc';
import { moneyAccRouter } from './moneyAcc.routes';
import { moneyRequestRouter } from './moneyRequest.routes';
import { greetingRouter } from './greeting.route';
import { orgRouter } from './org.routes';
import { projectRouter } from './project.routes';
import { accountsRouter } from './account.routes';
import { transactionsRouter } from './transactions/transaction.routes';
import { moneyApprovalRouter } from './moneyApproval.routes';
import { preferencesRouter } from './preferences.routes';
import { verificationLinksRouter } from './verificationLink.routes';
import { taxPayerRouter } from './taxPayer.routes';
import { expenseReportsRouter } from './ExpenseReport.routes';
import { imbursementsRouter } from './imbursements.routes';
import { seedRouter } from './seed.routes';
import { expenseReturnsRouter } from './ExpenseReturn.routes';
import { notificationsRouter } from './notifications.routes';

export const appRouter = router({
  account: accountsRouter,
  expenseReport: expenseReportsRouter,
  greeting: greetingRouter,
  healthcheck: publicProcedure.query(() => 'yay!'),
  imbursement: imbursementsRouter,
  moneyAcc: moneyAccRouter,
  moneyApprovals: moneyApprovalRouter,
  moneyRequest: moneyRequestRouter,
  org: orgRouter,
  preferences: preferencesRouter,
  project: projectRouter,
  seed: seedRouter,
  taxPayer: taxPayerRouter,
  transaction: transactionsRouter,
  verificationLinks: verificationLinksRouter,
  expenseReturn: expenseReturnsRouter,
  notifications: notificationsRouter,
});
export type AppRouter = typeof appRouter;
