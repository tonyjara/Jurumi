/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../initTrpc';
import { bankAccRouter } from './bankAcc.routes';
import { disbursmentRouter } from './disbursment.routes';
import { greetingRouter } from './greeting.route';
import { orgRouter } from './org.routes';
import { projectRouter } from './project.routes';
// import { postRouter } from './post';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  // post: postRouter,
  greeting: greetingRouter,
  org: orgRouter,
  bankAcc: bankAccRouter,
  project: projectRouter,
  disbursment: disbursmentRouter,
});

export type AppRouter = typeof appRouter;
