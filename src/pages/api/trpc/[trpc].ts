/**
 * This file contains tRPC's HTTP response handler
 */
import * as trpcNext from '@trpc/server/adapters/next';
import { createContext } from '../../../server/trpc/context';
import { appRouter } from '../../../server/trpc/routers/router';

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
      console.error('Something went wrong', error);
    }
  },
  batching: {
    enabled: true,
  },
  /**
   * @link https://trpc.io/docs/caching#api-response-caching
   */
  // responseMeta() {
  //   // ...
  // },
});
