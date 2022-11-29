import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createTRPCReact,
  getFetch,
  httpBatchLink,
  loggerLink,
} from '@trpc/react-query';
import SuperJSON from 'superjson';
import React from 'react';

// import './fetch-polyfill';
import type { AppRouter } from '../../server/trpc/routers/router';

export const trpc = createTRPCReact<AppRouter>({
  unstable_overrides: {
    useMutation: {
      async onSuccess(opts) {
        await opts.originalFn();
        await opts.queryClient.invalidateQueries();
      },
    },
  },
});

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    loggerLink({
      enabled: () => true,
    }),
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
      fetch: async (input, init?) => {
        const fetch = getFetch();
        return fetch(input, {
          ...init,
        });
      },
    }),
  ],
  transformer: SuperJSON,
});

export function TRPCTestClientProvider(props: { children: React.ReactNode }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient} contextSharing={false}>
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
