import { z } from 'zod';
import { protectedProcedure, router } from '../initTrpc';
import { getSelectedOrganizationId } from './utils/PreferencesRoutUtils';
import prisma from '@/server/db/client';

export const preferencesRouter = router({
  upsertSelectedOrg: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      return await prisma?.preferences.upsert({
        create: {
          accountId: user.id,
          selectedOrganization: input.organizationId,
        },
        update: { selectedOrganization: input.organizationId },
        where: { accountId: user.id },
      });
    }),
  getMyPreferences: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    return await getSelectedOrganizationId(user);
  }),
});
