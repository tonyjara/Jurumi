import type { Account } from '@prisma/client';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: Omit<Account, 'password'>;
    status: 'loading' | 'authenticated' | 'unauthenticated';
  }
}
