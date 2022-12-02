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

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  greeting: greetingRouter,
  org: orgRouter,
  moneyAcc: moneyAccRouter,
  project: projectRouter,
  moneyRequest: moneyRequestRouter,
  account: accountsRouter,
});

export type AppRouter = typeof appRouter;
