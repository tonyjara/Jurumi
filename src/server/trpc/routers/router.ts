/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../initTrpc';
import { moneyAccRouter } from './moneyAcc.routes';
import { disbursementRouter } from './disbursement.routes';
import { greetingRouter } from './greeting.route';
import { orgRouter } from './org.routes';
import { projectRouter } from './project.routes';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  greeting: greetingRouter,
  org: orgRouter,
  moneyAcc: moneyAccRouter,
  project: projectRouter,
  disbursement: disbursementRouter,
});

export type AppRouter = typeof appRouter;
