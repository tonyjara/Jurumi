import { Prisma } from '@prisma/client';
import { z } from 'zod';
import type { BankInfoModelType } from '../../../lib/validations/moneyAcc.validate';
import { validateMoneyAccount } from '../../../lib/validations/moneyAcc.validate';
import { adminProcedure, adminModProcedure, router } from '../initTrpc';

export const moneyAccRouter = router({
  getMany: adminModProcedure.query(async () => {
    return await prisma?.moneyAccount.findMany();
  }),

  getManyWithTransactions: adminModProcedure.query(async () => {
    return await prisma?.moneyAccount.findMany({
      include: {
        bankInfo: true,
        transactions: {
          orderBy: { id: 'desc' },
          include: {
            account: { select: { displayName: true } },
            moneyAccount: { select: { displayName: true } },
          },
        },
      },
      take: 20,
      orderBy: { id: 'desc' },
    });
  }),

  getManyBankAccs: adminModProcedure.query(async () => {
    return await prisma?.moneyAccount.findMany({
      where: { isCashAccount: false },
      include: {
        bankInfo: true,
        transactions: { take: 1, orderBy: { id: 'desc' } },
      },
    });
  }),
  getManyCashAccs: adminModProcedure.query(async () => {
    return await prisma?.moneyAccount.findMany({
      where: { isCashAccount: true },
      include: { transactions: { take: 1, orderBy: { id: 'desc' } } },
    });
  }),
  create: adminModProcedure
    .input(validateMoneyAccount)
    .mutation(async ({ input: i, ctx }) => {
      const bankInfo: BankInfoModelType | undefined = i.bankInfo
        ? {
            bankName: i.bankInfo.bankName,
            type: i.bankInfo.type,
            accountNumber: i.bankInfo.accountNumber,
            ownerName: i.bankInfo.ownerName,
            ownerDocType: i.bankInfo.ownerDocType,
            ownerDoc: i.bankInfo.ownerDoc,
            country: i.bankInfo.country,
            city: i.bankInfo.city,
            ownerContactNumber: i.bankInfo.ownerContactNumber,
          }
        : undefined;
      const x = await prisma?.moneyAccount.create({
        data: {
          createdById: ctx.session.user.id,
          isCashAccount: i.isCashAccount,
          displayName: i.displayName,
          currency: i.currency,
          initialBalance: new Prisma.Decimal(i.initialBalance),
          bankInfo: i.isCashAccount ? undefined : { create: bankInfo },
        },
      });
      return x;
    }),
  edit: adminModProcedure
    .input(validateMoneyAccount)
    .mutation(async ({ input: i, ctx }) => {
      const bankInfo: BankInfoModelType | undefined = i.bankInfo
        ? {
            bankName: i.bankInfo.bankName,
            type: i.bankInfo.type,
            accountNumber: i.bankInfo.accountNumber,
            ownerName: i.bankInfo.ownerName,
            ownerDocType: i.bankInfo.ownerDocType,
            ownerDoc: i.bankInfo.ownerDoc,
            country: i.bankInfo.country,
            city: i.bankInfo.city,
            ownerContactNumber: i.bankInfo.ownerContactNumber,
          }
        : undefined;

      const x = await prisma?.moneyAccount.update({
        where: { id: i.id },
        data: {
          createdById: ctx.session.user.id,
          isCashAccount: i.isCashAccount,
          displayName: i.displayName,
          currency: i.currency,
          initialBalance: new Prisma.Decimal(i.initialBalance),
          bankInfo: i.isCashAccount ? undefined : { update: bankInfo },
        },
      });
      return x;
    }),
  deleteById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const x = await prisma?.moneyAccount.delete({
        where: { id: input.id },
      });
      return x;
    }),
});
