import { validateAccount } from '@/lib/validations/account.validate';
import { adminModProcedure, publicProcedure, router } from '../initTrpc';
import { TRPCError } from '@trpc/server';
import { validateNewUser } from '@/lib/validations/newUser.validate';
import { verifyToken } from '@/lib/utils/asyncJWT';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { makeSignedToken } from './utils/VerificationLinks.routeUtils';
import { getSelectedOrganizationId } from './utils/Preferences.routeUtils';
import { handleOrderBy } from './utils/Sorting.routeUtils';
import prisma from '@/server/db/client';
import { subMinutes } from 'date-fns';
import { sendPasswordRecoveryLinkOnSengrid } from './notifications/sendgrid/passwordRecoverySend.notification.sengrid';
import { sendMagicLinkToNewUserSendgridNotification } from './notifications/sendgrid/sendMagicLinkToNewUser.notification.sendgrid';
import { saveEmailMsgToDb } from './notifications/db/saveEmailToDb';

export const magicLinksRouter = router({
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

      const verificationLink = await prisma?.account.update({
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
        include: {
          accountVerificationLinks: { take: 1, orderBy: { createdAt: 'desc' } },
          organizations: { select: { displayName: true } },
        },
      });
      if (process.env.NODE_ENV === 'production') {
        const msg = await sendMagicLinkToNewUserSendgridNotification({
          link,
          newUser: verificationLink,
        });
        if (!msg) return;
        await saveEmailMsgToDb({
          accountId: ctx.session.user.id,
          msg,
          tag: 'generateVerificationLink',
        });
      }
      return verificationLink;
    }),
  assignPasswordToNewAccount: publicProcedure
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
          where: { email: input.email.toLowerCase() },
          data: { hasBeenUsed: true },
        });

        return prisma?.account.update({
          where: { email: input.email.toLowerCase() },
          data: { password: hashedPass, isVerified: true },
        });
      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Token invalid.',
        });
      }
    }),
  assignPasswordFromRecovery: publicProcedure
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

      const getLink = await prisma?.passwordRecoveryLinks.findUnique({
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
        await prisma?.passwordRecoveryLinks.updateMany({
          where: { email: input.email.toLowerCase() },
          data: { hasBeenUsed: true },
        });

        return prisma?.account.update({
          where: { email: input.email.toLowerCase() },
          data: { password: hashedPass },
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
        input.email.toLowerCase(),
        input.displayName,
        uuid,
        secret
      );
      const baseUrl = process.env.NEXT_PUBLIC_WEB_URL;

      const link = `${baseUrl}/new-user/${signedToken}`;

      const newUser = await prisma.account.create({
        data: {
          displayName: input.displayName,
          email: input.email.toLowerCase(),
          role: input.role,
          isVerified: false,
          active: true,
          password: '',
          organizations: { connect: { id: prefs.selectedOrganization } },
          accountVerificationLinks: {
            create: {
              id: uuid,
              verificationLink: link,
              email: input.email.toLowerCase(),
              createdById: ctx.session.user.id,
            },
          },
          preferences: {
            create: { selectedOrganization: prefs.selectedOrganization },
          },
        },
        include: {
          accountVerificationLinks: true,
          organizations: { select: { displayName: true } },
        },
      });

      if (process.env.NODE_ENV === 'production') {
        const msg = await sendMagicLinkToNewUserSendgridNotification({
          link,
          newUser,
        });
        if (!msg) return;
        await saveEmailMsgToDb({
          accountId: ctx.session.user.id,
          msg,
          tag: 'createAccWithSignedLink',
        });
      }
      return newUser;
    }),
  createLinkForPasswordRecovery: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session?.user;
      const fetchedUser = await prisma.account.findUniqueOrThrow({
        where: { email: input.email },
      });
      //find if there was a password created in the last 5 minutes
      const freshPassLink = await prisma.passwordRecoveryLinks.findFirst({
        where: { createdAt: { gte: subMinutes(new Date(), 5) } },
      });
      if (!!freshPassLink) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User needs to wait more before new email',
        });
      }

      const secret = process.env.JWT_SECRET;
      const uuid = uuidv4();
      if (!secret) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'No secret or selectedOrg.',
        });
      }
      const signedToken = makeSignedToken(
        input.email,
        fetchedUser.displayName,
        uuid,
        secret
      );
      const baseUrl = process.env.NEXT_PUBLIC_WEB_URL;

      const link = `${baseUrl}/forgot-my-password/${signedToken}`;

      await prisma.passwordRecoveryLinks.create({
        data: {
          id: uuid,
          recoveryLink: link,
          email: input.email.toLowerCase(),
          accountId: fetchedUser.id,
        },
      });

      const msg = await sendPasswordRecoveryLinkOnSengrid({
        email: input.email.toLowerCase(),
        displayName: fetchedUser.displayName,
        link,
      });

      if (!msg) return;
      await saveEmailMsgToDb({
        msg,
        tag: 'passwordRecovery',
        accountId: user?.id ?? null,
      });
    }),
});
