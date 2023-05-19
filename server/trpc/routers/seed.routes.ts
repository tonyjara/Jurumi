import { z } from "zod";
import { adminProcedure, router } from "../initTrpc";
import prisma from "@/server/db/client";
import {
  expenseReturnMock,
  imbursementMock,
  moneyAccountOffsetMock,
  TransactionCreateMock,
} from "@/__tests__/mocks/Mocks";
import { appRouter } from "./router";
import { createSeedTransaction } from "./utils/Seed.routeUtils";
import { TRPCError } from "@trpc/server";
import { MockExpenseReport } from "@/lib/validations/expenseReport.validate";
import { MockMoneyRequest } from "@/lib/validations/moneyRequest.validate";

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
        const mock = MockMoneyRequest({
          organizationId: prefs.selectedOrganization,
          moneyRequestType: "FUND_REQUEST",
          projectId: project.id,
        });
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
        const requestMock = MockMoneyRequest({
          organizationId: prefs.selectedOrganization,
          moneyRequestType: "FUND_REQUEST",
          projectId: project.id,
        });

        requestMock.status = "ACCEPTED";

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
        const requestMock = MockMoneyRequest({
          organizationId: prefs.selectedOrganization,
          moneyRequestType: "REIMBURSMENT_ORDER",
          projectId: project.id,
        });
        requestMock.costCategoryId = project.costCategories[0].id;
        requestMock.status = "ACCEPTED";

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
        const requestMock = MockMoneyRequest({
          organizationId: prefs.selectedOrganization,
          moneyRequestType: "FUND_REQUEST",
          projectId: project.id,
        });

        requestMock.status = "ACCEPTED";

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

        const expenseRepMock = MockExpenseReport({
          moneyReqId: req.id,
          projectId: req.projectId,
          costCategoryId: project.costCategories[0].id,
        });
        expenseRepMock.amountSpent = req.amountRequested;
        expenseRepMock.accountId = user.id;

        await caller.expenseReport.create(expenseRepMock);
      }
    }),

  createApprovedReqsWithTxsAndExpenseReportsAndReturns: adminProcedure
    .input(z.object({ multiplier: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const caller = appRouter.createCaller({ session: ctx.session });

      const prefs = await caller.preferences.getMyPreferences();
      if (!prefs) return;

      const project = await prisma.project.findFirst({
        where: { organizationId: prefs.selectedOrganization },
        select: {
          id: true,
          costCategories: { take: 1, select: { id: true } },
        },
      });
      if (!project || !project.costCategories[0]) return;
      const moneyAcc = await prisma.moneyAccount.findFirst({
        select: { id: true },
      });
      if (!moneyAcc) return;

      for (let x = 1; x <= input.multiplier; x++) {
        const requestMock = MockMoneyRequest({
          organizationId: prefs.selectedOrganization,
          moneyRequestType: "FUND_REQUEST",
          projectId: project.id,
        });
        requestMock.status = "ACCEPTED";

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

        const expenseRepMock = MockExpenseReport({
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

  createApprovedReqsWithTxsAndExpenseReportsAndReturnsAndCostCats:
    adminProcedure
      .input(z.object({ multiplier: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const user = ctx.session.user;
        const caller = appRouter.createCaller({ session: ctx.session });

        const prefs = await caller.preferences.getMyPreferences();
        if (!prefs) return;

        const project = await prisma.project.findFirst({
          where: { organizationId: prefs.selectedOrganization },
          select: {
            id: true,
            costCategories: { select: { id: true } },
          },
        });

        if (!project || !project.costCategories[0])
          throw new Error("No cost categories");

        const moneyAcc = await prisma.moneyAccount.findFirst({
          select: { id: true },
        });
        if (!moneyAcc) throw new Error("No money account");

        for (let x = 1; x <= input.multiplier; x++) {
          const requestMock = MockMoneyRequest({
            organizationId: prefs.selectedOrganization,
            moneyRequestType: "FUND_REQUEST",
            projectId: project.id,
          });

          const random = Math.floor(
            Math.random() * project.costCategories.length
          );
          const randomCostCatId = project.costCategories[random]?.id;
          if (!randomCostCatId) throw new Error("No cost category id");
          requestMock.costCategoryId = randomCostCatId;

          requestMock.status = "ACCEPTED";

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

          const expenseRepMock = MockExpenseReport({
            moneyReqId: req.id,
            projectId: req.projectId,
            costCategoryId: randomCostCatId,
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

  createMoneyAccountOffset: adminProcedure
    .input(z.object({ multiplier: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const caller = appRouter.createCaller({ session: ctx.session });

      const prefs = await caller.preferences.getMyPreferences();
      if (!prefs) return;

      const moneyAcc = await prisma.moneyAccount.findFirst({
        include: { transactions: true },
      });
      if (!moneyAcc) return;

      for (let x = 1; x <= input.multiplier; x++) {
        const mock = moneyAccountOffsetMock({
          moneyAccountId: moneyAcc.id,
          currency: moneyAcc.currency,
          previousBalance: moneyAcc.transactions.length
            ? moneyAcc.transactions[0]?.currentBalance
            : moneyAcc.initialBalance,
        });
        await caller.moneyAcc.offsetBalance(mock);
      }
    }),

  deleteALLTransactions: adminProcedure.mutation(async () => {
    if (process.env.NODE_ENV !== "development") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not allowed in prod.",
      });
    }
    await prisma.transaction.deleteMany();
  }),
  deleteALLMoneyRequests: adminProcedure.mutation(async () => {
    if (process.env.NODE_ENV !== "development") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not allowed in prod.",
      });
    }
    await prisma.moneyRequest.deleteMany();
  }),
  deleteALLExpenseReports: adminProcedure.mutation(async () => {
    if (process.env.NODE_ENV !== "development") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not allowed in prod.",
      });
    }
    await prisma.expenseReport.deleteMany();
  }),
  deleteAllImbursements: adminProcedure.mutation(async () => {
    if (process.env.NODE_ENV !== "development") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not allowed in prod.",
      });
    }

    await prisma.imbursement.deleteMany();
  }),
  deleteALLExpenseReturns: adminProcedure.mutation(async () => {
    if (process.env.NODE_ENV !== "development") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not allowed in prod.",
      });
    }

    await prisma.expenseReturn.deleteMany();
  }),
  deleteAllMoneyApprovals: adminProcedure.mutation(async () => {
    if (process.env.NODE_ENV !== "development") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not allowed in prod.",
      });
    }

    await prisma.moneyRequestApproval.deleteMany();
  }),

  deleteManyMoneyAccountOffsets: adminProcedure.mutation(async () => {
    if (process.env.NODE_ENV !== "development") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not allowed in prod.",
      });
    }

    await prisma.moneyAccountOffset.deleteMany();
  }),
});
