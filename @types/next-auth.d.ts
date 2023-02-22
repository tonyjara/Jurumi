import type { Account } from '@prisma/client';
import { type DefaultSession } from 'next-auth';
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: Omit<Account, 'password'> & {
      profile: {
        avatarUrl: string;
      } | null;
    } & DefaultSession['user'];
    status: 'loading' | 'authenticated' | 'unauthenticated';
  }
}
