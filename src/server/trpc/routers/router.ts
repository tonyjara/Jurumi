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
import { transactionsRouter } from './transaction.routes';
import { moneyApprovalRouter } from './moneyApproval.routes';
import { preferencesRouter } from './preferences.routes';
import { verificationLinksRouter } from './verificationLink.routes';
import { taxPayerRouter } from './taxPayer.routes';

export const appRouter = router({
  account: accountsRouter,
  greeting: greetingRouter,
  healthcheck: publicProcedure.query(() => 'yay!'),
  moneyAcc: moneyAccRouter,
  moneyApprovals: moneyApprovalRouter,
  moneyRequest: moneyRequestRouter,
  org: orgRouter,
  preferences: preferencesRouter,
  project: projectRouter,
  transaction: transactionsRouter,
  verificationLinks: verificationLinksRouter,
  taxPayer: taxPayerRouter,
});

export type AppRouter = typeof appRouter;
