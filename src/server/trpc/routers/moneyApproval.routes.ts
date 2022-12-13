import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { validateOrgCreate } from '../../../lib/validations/org.validate';
import { adminProcedure, adminModProcedure, router } from '../initTrpc';

export const moneyApprovalRouter = router({
  approve: adminModProcedure
    .input(z.object({ moneyRequestId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      // const x = await

      return;
    }),
  //   edit: adminModProcedure
  //     .input(validateOrgCreate)
  //     .mutation(async ({ input, ctx }) => {
  //       const user = ctx.session.user;

  //       //fetch old approvers first

  //       const fetchedOrg = await prisma?.organization.findUnique({
  //         where: { id: input.id },
  //         select: {
  //           moneyAdministrators: { select: { id: true } },
  //           moneyRequestApprovers: { select: { id: true } },
  //         },
  //       });

  //       if (!fetchedOrg) {
  //         throw new TRPCError({
  //           code: 'BAD_REQUEST',
  //           message: 'not found',
  //         });
  //       }
  //       const moneyAdminIds = fetchedOrg.moneyAdministrators;
  //       const moneyReqApproverIds = fetchedOrg.moneyRequestApprovers;

  //       const org = await prisma?.organization.update({
  //         where: { id: input.id },
  //         data: {
  //           displayName: input.displayName,
  //           updatedById: user.id,
  //           moneyRequestApprovers: {
  //             disconnect: moneyReqApproverIds, //disconnect old, connect new
  //             connect: input.moneyRequestApprovers.map((x) => ({ id: x.id })),
  //           },
  //           moneyAdministrators: {
  //             disconnect: moneyAdminIds, //disconnect old, connect new
  //             connect: input.moneyAdministrators.map((x) => ({ id: x.id })),
  //           },
  //         },
  //       });
  //       return org;
  //     }),
  //   deleteById: adminProcedure
  //     .input(
  //       z.object({
  //         id: z.string(),
  //       })
  //     )
  //     .mutation(async ({ input }) => {
  //       const org = await prisma?.organization.delete({
  //         where: { id: input.id },
  //       });
  //       return org;
  //     }),
});
