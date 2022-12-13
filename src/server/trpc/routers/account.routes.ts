import { validateAccount } from '../../../lib/validations/account.validate';
import {
  adminModProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from '../initTrpc';
import jwt from 'jsonwebtoken';
import { TRPCError } from '@trpc/server';
import { getBaseUrl } from '../../../lib/utils/trpcClient';
import { validateNewUser } from '../../../lib/validations/newUser.validate';
import { verifyToken } from '../../../lib/utils/asyncJWT';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { initialSetupValidation } from '../../../lib/validations/setup.validate';

export const accountsRouter = router({
  toggleActivation: adminModProcedure
    .input(z.object({ id: z.string(), active: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'No user session.',
        });
      }
      return await prisma?.account.update({
        where: {
          id: input.id,
        },
        data: { active: input.active },
      });
    }),
  getUnique: protectedProcedure.query(async ({ ctx }) => {
    return await prisma?.account.findUnique({
      where: {
        email: ctx.session.user.email,
      },
    });
  }),

  getMany: adminModProcedure.query(async () => {
    return await prisma?.account.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
  }),
  getAllActive: adminModProcedure.query(async () => {
    //Use this to build options with react-select
    return await prisma?.account.findMany({
      where: { active: true },
      orderBy: { displayName: 'asc' },
      select: { id: true, displayName: true, email: true },
    });
  }),
  getVerificationLinks: adminModProcedure.query(async () => {
    return await prisma?.accountVerificationLinks.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
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
      const signedToken = jwt.sign(
        {
          data: {
            email: input.email,
            displayName: input.displayName,
            linkId: uuid,
          },
        },
        secret,
        { expiresIn: 60 * 60 }
      );
      const baseUrl = getBaseUrl();
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
      const secret = process.env.JWT_SECRET;
      const uuid = uuidv4();
      if (!secret) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'No user session.',
        });
      }
      const signedToken = jwt.sign(
        {
          data: {
            email: input.email,
            displayName: input.displayName,
            linkId: uuid,
          },
        },
        secret,
        { expiresIn: 60 * 60 }
      ) as string;
      const baseUrl = getBaseUrl();
      const link = `${baseUrl}/new-user/${signedToken}`;

      return await prisma?.account.create({
        data: {
          displayName: input.displayName,
          email: input.email,
          role: input.role,
          isVerified: false,
          active: true,
          password: '',

          accountVerificationLinks: {
            create: {
              id: uuid,
              verificationLink: link,
              email: input.email,
              createdById: ctx.session.user.id,
            },
          },
        },
        include: { accountVerificationLinks: true },
      });
    }),
  createOneUNSAFE: publicProcedure
    .input(initialSetupValidation)
    .mutation(async ({ input }) => {
      const accounts = await prisma?.account.findMany();
      if (accounts?.length) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Only allowed when no accounts.',
        });
      }

      const hashedPass = await bcrypt.hash(input.password, 10);

      return await prisma?.account.create({
        data: {
          displayName: input.displayName,
          email: input.email,
          role: 'ADMIN',
          isVerified: true,
          active: true,
          password: hashedPass,
        },
      });
    }),
});
