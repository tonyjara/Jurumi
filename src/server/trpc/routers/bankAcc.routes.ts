import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { validateBankAccountCreate } from '../../../lib/validations/bankAcc.create.validate';
import { validateOrgCreate } from '../../../lib/validations/org.create.validate';
import { adminProcedure, protectedProcedure, router } from '../initTrpc';

export const bankAccRouter = router({
  getMany: protectedProcedure.query(async () => {
    return await prisma?.bankAccount.findMany();
  }),
  create: protectedProcedure
    .input(validateBankAccountCreate)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'No user session.',
        });
      }

      const org = await prisma?.bankAccount.create({
        data: {
          accountNumber: input.accountNumber,
          createdById: ctx.session.user.id,
          bankName: input.bankName,
          ownerName: input.ownerName,
          ownerDocType: input.ownerDocType,
          ownerDoc: input.ownerDoc,
          ownerContactNumber: input.ownerContactNumber,
          currency: input.currency,
          type: input.type,
          country: input.country,
          city: input.city,
          balance: new Prisma.Decimal(input.balance),
        },
      });
      return org;
    }),
  //   edit: protectedProcedure
  //     .input(validateOrgEdit)
  //     .mutation(async ({ input }) => {
  //       const org = await prisma?.organization.update({
  //         where: { id: input.id },
  //         data: { displayName: input.displayName },
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
