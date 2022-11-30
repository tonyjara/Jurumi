/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../initTrpc';
import { bankAccRouter } from './bankAcc.routes';
import { disbursementRouter } from './disbursement.routes';
import { greetingRouter } from './greeting.route';
import { orgRouter } from './org.routes';
import { pettyCashRouter } from './pettyCash.routes';
import { projectRouter } from './project.routes';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  greeting: greetingRouter,
  org: orgRouter,
  bankAcc: bankAccRouter,
  project: projectRouter,
  disbursement: disbursementRouter,
  pettyCash: pettyCashRouter,
});

export type AppRouter = typeof appRouter;
