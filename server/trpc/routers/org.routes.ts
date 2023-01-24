import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import type { FormOrganization } from '@/lib/validations/org.validate';
import { validateOrganization } from '@/lib/validations/org.validate';
import {
  adminProcedure,
  adminModProcedure,
  router,
  protectedProcedure,
} from '../initTrpc';
import prisma from '@/server/db/client';
import { createImageLogo } from './utils/Org.routeUtils';

export const orgRouter = router({
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const prefs = await prisma.preferences.findUniqueOrThrow({
      where: { accountId: user.id },
    });
    return await prisma?.organization.findUnique({
      where: { id: prefs.selectedOrganization },
      include: {
        imageLogo: { select: { id: true, imageName: true, url: true } },
      },
    });
  }),
  getMany: adminModProcedure.query(async () => {
    return await prisma?.organization.findMany({
      include: {
        moneyAdministrators: { select: { id: true, displayName: true } },
        moneyRequestApprovers: { select: { id: true, displayName: true } },
      },
    });
  }),
  getMyOrgs: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    return await prisma?.account.findUnique({
      where: { id: user.id },
      select: { organizations: { select: { id: true, displayName: true } } },
    });
  }),
  getForDashboard: adminModProcedure
    .input(z.object({ orgId: z.string().optional() }))
    .query(async ({ input }) => {
      if (!input.orgId) return null;

      return await prisma?.organization.findUnique({
        where: { id: input.orgId },
        include: {
          moneyAccounts: {
            include: { transactions: { take: 1, orderBy: { id: 'desc' } } },
          },
          imageLogo: { select: { id: true, imageName: true, url: true } },
          moneyRequestApprovers: true,
          moneyAdministrators: true,
          projects: {
            include: {
              transactions: { take: 1, orderBy: { id: 'desc' } },
              costCategories: {
                include: { transactions: { take: 1, orderBy: { id: 'desc' } } },
              },
              imbursements: {
                include: { transactions: { take: 1, orderBy: { id: 'desc' } } },
              },
            },
          },
        },
      });
    }),
  getManyForSelect: adminModProcedure.input(z.object({})).query(async () => {
    return await prisma?.organization.findMany({
      select: { id: true, displayName: true },
    });
  }),
  create: adminModProcedure
    .input(validateOrganization)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;

      const imageLogo = await createImageLogo({ input });

      const org = await prisma?.organization.create({
        data: {
          createdById: user.id,
          displayName: input.displayName,
          moneyRequestApprovers: {
            connect: input.moneyRequestApprovers.map((x) => ({ id: x.id })),
          },
          moneyAdministrators: {
            connect: input.moneyAdministrators.map((x) => ({ id: x.id })),
          },
          members: { connect: { id: user.id } },
          imageLogo: imageLogo ? { connect: { id: imageLogo.id } } : {},
        },
      });
      return org;
    }),
  edit: adminModProcedure
    .input(validateOrganization)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;

      //fetch old approvers first

      const fetchedOrg = await prisma?.organization.findUnique({
        where: { id: input.id },
        select: {
          moneyAdministrators: { select: { id: true } },
          moneyRequestApprovers: { select: { id: true } },
        },
      });

      if (!fetchedOrg) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'not found',
        });
      }
      const moneyAdminIds = fetchedOrg.moneyAdministrators;
      const moneyReqApproverIds = fetchedOrg.moneyRequestApprovers;

      const createImageLogo = async () => {
        if (!input.imageLogo) return null;

        return await prisma?.searchableImage.upsert({
          where: {
            imageName: input.imageLogo?.imageName,
          },
          create: {
            url: input.imageLogo.url,
            imageName: input.imageLogo.imageName,
            text: '',
          },
          update: {},
        });
      };
      const imageLogo = await createImageLogo();

      const org = await prisma?.organization.update({
        where: { id: input.id },
        data: {
          displayName: input.displayName,
          updatedById: user.id,
          searchableImageId: imageLogo?.id ?? null,
          moneyRequestApprovers: {
            disconnect: moneyReqApproverIds, //disconnect old, connect new
            connect: input.moneyRequestApprovers.map((x) => ({ id: x.id })),
          },
          moneyAdministrators: {
            disconnect: moneyAdminIds, //disconnect old, connect new
            connect: input.moneyAdministrators.map((x) => ({ id: x.id })),
          },
        },
      });
      return org;
    }),
  deleteById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const org = await prisma?.organization.delete({
        where: { id: input.id },
      });
      return org;
    }),
});
