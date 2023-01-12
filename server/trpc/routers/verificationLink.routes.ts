import { validateAccount } from '../../../lib/validations/account.validate';
import { adminModProcedure, publicProcedure, router } from '../initTrpc';
import { TRPCError } from '@trpc/server';
import { validateNewUser } from '../../../lib/validations/newUser.validate';
import { verifyToken } from '../../../lib/utils/asyncJWT';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { makeSignedToken } from './utils/VerificationLinkRouteUtils';
import { getSelectedOrganizationId } from './utils/PreferencesRoutUtils';
import { handleOrderBy } from './utils/SortingUtils';
import prisma from '@/server/db/client';

export const verificationLinksRouter = router({
  count: adminModProcedure.query(async () => {
    return await prisma?.accountVerificationLinks.count();
  }),
  getVerificationLinks: adminModProcedure
    .input(
      z.object({
        pageIndex: z.number().nullish(),
        pageSize: z.number().min(1).max(100).nullish(),
        sorting: z
          .object({ id: z.string(), desc: z.boolean() })
          .array()
          .nullish(),
      })
    )
    .query(async ({ input }) => {
      const pageSize = input.pageSize ?? 10;
      const pageIndex = input.pageIndex ?? 0;

      return await prisma?.accountVerificationLinks.findMany({
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: handleOrderBy({ input }),
        include: { account: { select: { displayName: true } } },
      });
    }),
  generateVerificationLink: adminModProcedure
    .input(z.object({ email: z.string(), displayName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const secret = process.env.JWT_SECRET;
      const uuid = uuidv4();
      if (!secret || !ctx.session?.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'No user session.',
        });
      }
      const signedToken = makeSignedToken(
        input.email,
        input.displayName,
        uuid,
        secret
      );
      const baseUrl = process.env.NEXT_PUBLIC_WEB_URL;
      const link = `${baseUrl}/new-user/${signedToken}`;

      return await prisma?.account.update({
        where: { email: input.email },
        data: {
          accountVerificationLinks: {
            create: {
              id: uuid,
              verificationLink: link,
              email: input.email,
              createdById: ctx.session.user.id,
            },
          },
        },
      });
    }),
  assignPassword: publicProcedure
    .input(validateNewUser)
    .mutation(async ({ input }) => {
      const secret = process.env.JWT_SECRET;

      if (!secret) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'No secret.',
        });
      }

      const handleToken = await verifyToken(input.token, secret);

      const getLink = await prisma?.accountVerificationLinks.findUnique({
        where: { id: input.linkId },
      });
      if (getLink?.hasBeenUsed) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Link already used.',
        });
      }

      const hashedPass = await bcrypt.hash(input.password, 10);

      if (handleToken && 'data' in handleToken) {
        // makes sure all links are invalidated
        await prisma?.accountVerificationLinks.updateMany({
          where: { email: input.email },
          data: { hasBeenUsed: true },
        });

        return prisma?.account.update({
          where: { email: input.email },
          data: { password: hashedPass, isVerified: true },
        });
      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Token invalid.',
        });
      }
    }),

  createWithSigendLink: adminModProcedure
    .input(validateAccount)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      if (input.role === 'ADMIN' && user.role !== 'ADMIN') {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Only admins can create admins.',
        });
      }
      const prefs = await getSelectedOrganizationId(user);
      const secret = process.env.JWT_SECRET;
      const uuid = uuidv4();
      if (!secret || !prefs?.selectedOrganization) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'No secret or selectedOrg.',
        });
      }
      const signedToken = makeSignedToken(
        input.email,
        input.displayName,
        uuid,
        secret
      );
      const baseUrl = process.env.NEXT_PUBLIC_WEB_URL;

      const link = `${baseUrl}/new-user/${signedToken}`;

      return await prisma?.account.create({
        data: {
          displayName: input.displayName,
          email: input.email,
          role: input.role,
          isVerified: false,
          active: true,
          password: '',
          organizations: { connect: { id: prefs.selectedOrganization } },
          accountVerificationLinks: {
            create: {
              id: uuid,
              verificationLink: link,
              email: input.email,
              createdById: ctx.session.user.id,
            },
          },
          preferences: {
            create: { selectedOrganization: prefs.selectedOrganization },
          },
        },
        include: { accountVerificationLinks: true },
      });
    }),
});
