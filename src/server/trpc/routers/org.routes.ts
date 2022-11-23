import { z } from 'zod';
import { validateOrgCreate } from '../../../lib/validations/org.create.validate';
import { validateOrgEdit } from '../../../lib/validations/org.edit.validate';
import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from '../initTrpc';

export const orgRouter = router({
  getMany: publicProcedure.query(async () => {
    return await prisma?.organization.findMany();
  }),
  create: protectedProcedure
    .input(validateOrgCreate)
    .mutation(async ({ input }) => {
      const org = await prisma?.organization.create({
        data: {
          createdById: input.createdById,
          displayName: input.displayName,
          account: { connect: { id: input.createdById } },
        },
      });
      return org;
    }),
  edit: protectedProcedure
    .input(validateOrgEdit)
    .mutation(async ({ input }) => {
      const org = await prisma?.organization.update({
        where: { id: input.id },
        data: { displayName: input.displayName },
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
