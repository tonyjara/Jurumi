import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { validateBankAccountCreate } from '../../../lib/validations/bankAcc.validate';
import { adminProcedure, protectedProcedure, router } from '../initTrpc';

export const bankAccRouter = router({
  getMany: protectedProcedure.query(async () => {
    return await prisma?.bankAccount.findMany();
  }),
  create: protectedProcedure
    .input(validateBankAccountCreate)
    .mutation(async ({ input, ctx }) => {
      // console.log(input);

      if (!ctx.session.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'No user session.',
        });
      }
      // return {};
      const bankAcc = await prisma?.bankAccount.create({
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
      return bankAcc;
    }),
  edit: protectedProcedure
    .input(validateBankAccountCreate)
    .mutation(async ({ input, ctx }) => {
      const bankAcc = await prisma?.bankAccount.update({
        where: { id: input.id },
        data: {
          accountNumber: input.accountNumber,
          updatedById: ctx.session.user.id,
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
      return bankAcc;
    }),
  deleteById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const BankAcc = await prisma?.bankAccount.delete({
        where: { id: input.id },
      });
      return BankAcc;
    }),
});
