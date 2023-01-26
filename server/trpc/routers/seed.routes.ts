import { z } from 'zod';
import { adminProcedure, router } from '../initTrpc';
import prisma from '@/server/db/client';
import {
  expenseReportMock,
  expenseReturnMock,
  imbursementMock,
  moneyRequestMock,
  TransactionCreateMock,
} from '@/__tests__/mocks/Mocks';
import { appRouter } from './router';
import { createSeedTransaction } from './utils/Seed.routeUtils';
import { TRPCError } from '@trpc/server';

export const seedRouter = router({
  createMoneyRequests: adminProcedure
    .input(z.object({ multiplier: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const caller = appRouter.createCaller({ session: ctx.session });

      const prefs = await caller.preferences.getMyPreferences();
      if (!prefs) return;

      const project = await prisma.project.findFirst({
        where: { organizationId: prefs.selectedOrganization },
        select: { id: true },
      });
      if (!project) return;

      for (let x = 1; x <= input.multiplier; x++) {
        const mock = moneyRequestMock({
          organizationId: prefs.selectedOrganization,
          moneyRequestType: 'FUND_REQUEST',
        });
        mock.projectId = project.id;
        await caller.moneyRequest.create(mock);
      }
    }),

  createFundRequestWithTx: adminProcedure
    .input(z.object({ multiplier: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const caller = appRouter.createCaller({ session: ctx.session });

      const prefs = await caller.preferences.getMyPreferences();
      if (!prefs) return;

      const project = await prisma.project.findFirst({
        where: { organizationId: prefs.selectedOrganization },
        select: { id: true, costCategories: { take: 1, select: { id: true } } },
      });
      if (!project || !project.costCategories[0]) return;
      const moneyAcc = await prisma.moneyAccount.findFirst({
        select: { id: true },
      });
      if (!moneyAcc) return;

      for (let x = 1; x <= input.multiplier; x++) {
        const requestMock = moneyRequestMock({
          organizationId: prefs.selectedOrganization,
          moneyRequestType: 'FUND_REQUEST',
        });
        requestMock.projectId = project.id;

        requestMock.status = 'ACCEPTED';

        const req = await caller.moneyRequest.create(requestMock);
        if (!req.projectId) return;

        const txMock = TransactionCreateMock();

        await createSeedTransaction({
          txMock,
          moneyAccId: moneyAcc.id,
          projectId: req.projectId,
          moneyReqId: req.id,
          userId: user.id,
          amountRequested: req.amountRequested,
          caller,
        });
      }
    }),
  createReimbursementOrderWithTx: adminProcedure
    .input(z.object({ multiplier: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const caller = appRouter.createCaller({ session: ctx.session });

      const prefs = await caller.preferences.getMyPreferences();
      if (!prefs) return;

      const project = await prisma.project.findFirst({
        where: { organizationId: prefs.selectedOrganization },
        select: { id: true, costCategories: { take: 1, select: { id: true } } },
      });
      if (!project || !project.costCategories[0]) return;
      const moneyAcc = await prisma.moneyAccount.findFirst({
        select: { id: true },
      });
      if (!moneyAcc) return;

      for (let x = 1; x <= input.multiplier; x++) {
        const requestMock = moneyRequestMock({
          organizationId: prefs.selectedOrganization,
          moneyRequestType: 'REIMBURSMENT_ORDER',
        });
        requestMock.projectId = project.id;
        requestMock.costCategoryId = project.costCategories[0].id;
        requestMock.status = 'ACCEPTED';

        const req = await caller.moneyRequest.create(requestMock);
        if (!req.projectId) return;

        const txMock = TransactionCreateMock();

        await createSeedTransaction({
          txMock,
          moneyAccId: moneyAcc.id,
          projectId: req.projectId,
          moneyReqId: req.id,
          userId: user.id,
          costCategoryId: req.costCategoryId ?? undefined,
          amountRequested: req.amountRequested,
          caller,
        });
      }
    }),
  createApprovedMoneyReqWithTxAndWithExpenseReport: adminProcedure
    .input(z.object({ multiplier: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const caller = appRouter.createCaller({ session: ctx.session });

      const prefs = await caller.preferences.getMyPreferences();
      if (!prefs) return;

      const project = await prisma.project.findFirst({
        where: { organizationId: prefs.selectedOrganization },
        select: { id: true, costCategories: { take: 1, select: { id: true } } },
      });
      if (!project || !project.costCategories[0]) return;
      const moneyAcc = await prisma.moneyAccount.findFirst({
        select: { id: true },
      });
      if (!moneyAcc) return;

      for (let x = 1; x <= input.multiplier; x++) {
        const requestMock = moneyRequestMock({
          organizationId: prefs.selectedOrganization,
          moneyRequestType: 'FUND_REQUEST',
        });
        requestMock.projectId = project.id;
        requestMock.status = 'ACCEPTED';

        const req = await caller.moneyRequest.create(requestMock);
        if (!req.projectId) return;

        const txMock = TransactionCreateMock();

        await createSeedTransaction({
          txMock,
          moneyAccId: moneyAcc.id,
          projectId: req.projectId,
          moneyReqId: req.id,
          userId: user.id,
          amountRequested: req.amountRequested,
          caller,
        });

        const expenseRepMock = expenseReportMock({
          moneyReqId: req.id,
          projectId: req.projectId,
          costCategoryId: project.costCategories[0].id,
        });
        expenseRepMock.amountSpent = req.amountRequested;
        expenseRepMock.accountId = user.id;

        await caller.expenseReport.create(expenseRepMock);
      }
    }),
  createApprovedMoneyReqWithTxAndExReportAndReturn: adminProcedure
    .input(z.object({ multiplier: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const caller = appRouter.createCaller({ session: ctx.session });

      const prefs = await caller.preferences.getMyPreferences();
      if (!prefs) return;

      const project = await prisma.project.findFirst({
        where: { organizationId: prefs.selectedOrganization },
        select: { id: true, costCategories: { take: 1, select: { id: true } } },
      });
      if (!project || !project.costCategories[0]) return;
      const moneyAcc = await prisma.moneyAccount.findFirst({
        select: { id: true },
      });
      if (!moneyAcc) return;

      for (let x = 1; x <= input.multiplier; x++) {
        const requestMock = moneyRequestMock({
          organizationId: prefs.selectedOrganization,
          moneyRequestType: 'FUND_REQUEST',
        });
        requestMock.projectId = project.id;
        requestMock.status = 'ACCEPTED';

        const req = await caller.moneyRequest.create(requestMock);
        if (!req.projectId) return;

        const txMock = TransactionCreateMock();

        await createSeedTransaction({
          txMock,
          moneyAccId: moneyAcc.id,
          projectId: req.projectId,
          moneyReqId: req.id,
          userId: user.id,
          amountRequested: req.amountRequested,
          caller,
        });

        const expenseRepMock = expenseReportMock({
          moneyReqId: req.id,
          projectId: req.projectId,
          costCategoryId: project.costCategories[0].id,
        });
        (expenseRepMock.amountSpent = req.amountRequested.dividedBy(2)),
          (expenseRepMock.accountId = user.id);

        await caller.expenseReport.create(expenseRepMock);

        const expenseRetMock = expenseReturnMock({
          moneyAccountId: moneyAcc.id,
          moneyRequestId: req.id,
          amountReturned: req.amountRequested.dividedBy(2),
        });

        expenseRetMock.accountId = user.id;

        await caller.expenseReturn.create(expenseRetMock);
      }
    }),
  createImbursements: adminProcedure
    .input(z.object({ multiplier: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const caller = appRouter.createCaller({ session: ctx.session });

      const prefs = await caller.preferences.getMyPreferences();
      if (!prefs) return;

      const project = await prisma.project.findFirst({
        where: { organizationId: prefs.selectedOrganization },
        select: { id: true, displayName: true },
      });
      if (!project) return;
      const moneyAcc = await prisma.moneyAccount.findFirst({
        select: { id: true, displayName: true },
      });
      if (!moneyAcc) return;

      for (let x = 1; x <= input.multiplier; x++) {
        const mock = imbursementMock(
          [{ value: moneyAcc.id, label: moneyAcc.displayName }],
          [{ value: project.id, label: project.displayName }]
        );
        mock.accountId = user.id;
        await caller.imbursement.create(mock);
      }
    }),
  deleteALLTransactions: adminProcedure.mutation(async () => {
    if (process.env.NODE_ENV !== 'development') {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not allowed in prod.',
      });
    }
    await prisma.transaction.deleteMany();
  }),
  deleteALLMoneyRequests: adminProcedure.mutation(async () => {
    if (process.env.NODE_ENV !== 'development') {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not allowed in prod.',
      });
    }
    await prisma.moneyRequest.deleteMany();
  }),
  deleteALLExpenseReports: adminProcedure.mutation(async () => {
    if (process.env.NODE_ENV !== 'development') {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not allowed in prod.',
      });
    }
    await prisma.expenseReport.deleteMany();
  }),
  deleteAllImbursements: adminProcedure.mutation(async () => {
    if (process.env.NODE_ENV !== 'development') {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not allowed in prod.',
      });
    }

    await prisma.imbursement.deleteMany();
  }),
  deleteALLExpenseReturns: adminProcedure.mutation(async () => {
    if (process.env.NODE_ENV !== 'development') {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not allowed in prod.',
      });
    }

    await prisma.expenseReturn.deleteMany();
  }),
});
