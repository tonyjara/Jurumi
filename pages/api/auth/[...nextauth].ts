import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// Prisma adapter for NextAuth, optional and can be removed
import bcrypt from 'bcryptjs';
import prisma from '@/server/db/client';
import type { Account } from '@prisma/client';

// CALLBACKS GET EVERY TIME THE APP GETS REFRESHED

export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: async ({ token, account, user }) => {
      /* 
      Purpose of this function is to receive the information from authorize and add jwt token information.
      - user is the return from authorize
      - account describes type and provider, ex:
       {"type":"credentials","provider":"credentials"}
      - token holds the iat, exo and jti.
       */

      if (account?.type === 'credentials') {
        token.user = user;
      }

      return token;
    },

    session: async ({ session, token }) => {
      /* Purpose of this callback is to handle the session object.
      ession has the user object with authorize return and the expiration date.
      token has the same info as the jwt, it has the user with the authorize return and iat, exp and jti
      
      */

      session.user = token.user as Omit<Account, 'password'> & {
        profile: {
          avatarUrl: string;
        } | null;
      };
      return session;
    },
  },
  // Configure one or more authentication providers

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        // keys added here will be part of the credentials type.
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) return null;
        // Purpose of this function is to check if the email and password exist and match the hashed password in the database.
        // If they match we strip the password and we return the user object we want to keep on the session.

        const prismaUser = await prisma.account.findUnique({
          where: {
            email: credentials.email,
          },
          include: { profile: { select: { avatarUrl: true } } },
        });
        if (!prismaUser) return null;

        if (!prismaUser.isVerified || !prismaUser.active) return null;

        const matchesHash = await bcrypt.compare(
          credentials.password,
          prismaUser.password //hashed pass
        );
        if (!matchesHash) return null;
        //@ts-ignore
        delete prismaUser.password;

        return prismaUser;
      },
    }),
  ],
  session: {
    maxAge: 12 * 60 * 60, // 12 hours
    updateAge: 12 * 60 * 60, // 12 hours
    strategy: 'jwt',
  },
};

export default NextAuth(authOptions);
