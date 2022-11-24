/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../initTrpc';
import { bankAccRouter } from './bankAcc.routes';
import { greetingRouter } from './greeting.route';
import { orgRouter } from './org.routes';
// import { postRouter } from './post';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  // post: postRouter,
  greeting: greetingRouter,
  org: orgRouter,
  bankAcc: bankAccRouter,
});

export type AppRouter = typeof appRouter;
