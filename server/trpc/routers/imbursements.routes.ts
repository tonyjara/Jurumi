import { validateImbursement } from "@/lib/validations/imbursement.validate";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  adminProcedure,
  adminModProcedure,
  router,
  adminModObserverProcedure,
} from "../initTrpc";
import { handleOrderBy } from "./utils/Sorting.routeUtils";
import prisma from "@/server/db/client";
import { imbursementCreateUtils } from "./utils/Imbursement.routeUtils";
import { cancelTransactionsAndRevertBalance } from "./utils/Cancelations.routeUtils";
import { upsertTaxPayer } from "./utils/TaxPayer.routeUtils";
import { getManyImbursementsArgs } from "@/pageContainers/mod/imbursements/Imbursements.types";

const {
  createMoneyAccImbursementTx,
  createProjectImbursementTx,
  createInvoiceFromOrg,
  createImbursement,
  createImbursementProof,
} = imbursementCreateUtils;

export const imbursementsRouter = router({
  getMany: adminModObserverProcedure.query(async () => {
    return await prisma?.moneyRequest.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
    });
  }),
  getManyComplete: adminModObserverProcedure
    .input(
      z.object({
        pageIndex: z.number().nullish(),
        pageSize: z.number().min(1).max(100).nullish(),
        whereFilterList: z.any().array().optional(),
        sorting: z
          .object({ id: z.string(), desc: z.boolean() })
          .array()
          .nullish(),
      }),
    )
    .query(async ({ input }) => {
      const pageSize = input.pageSize ?? 10;
      const pageIndex = input.pageIndex ?? 0;

      return await prisma?.imbursement.findMany({
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: handleOrderBy({ input }),
        where: { AND: [...(input?.whereFilterList ?? [])] },
        ...getManyImbursementsArgs,
        // include: {
        //   transactions: { select: { id: true } },
        //   taxPayer: { select: { razonSocial: true, ruc: true, id: true } },
        //   project: { select: { id: true, displayName: true } },
        //   imbursementProof: { select: { imageName: true, url: true } },
        //   invoiceFromOrg: { select: { imageName: true, url: true } },
        //   moneyAccount: { select: { displayName: true } },
        //   account: { select: { id: true, displayName: true } },
        // },
      });
    }),
  count: adminModObserverProcedure
    .input(
      z.object({
        whereFilterList: z.any().array().optional(),
      }),
    )
    .query(async ({ input }) =>
      prisma?.imbursement.count({
        where: {
          AND: [...(input?.whereFilterList ?? [])],
        },
      }),
    ),

  create: adminModProcedure
    .input(validateImbursement)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      input.accountId = user.id;
      // Creates imbursments, connects taxpayer, creates images and transactions for money accounts and for projects.
      return await prisma?.$transaction(async (txCtx) => {
        const taxPayer = await upsertTaxPayer({
          input: input.taxPayer,
          userId: user.id,
        });

        if (!taxPayer || !input.moneyAccountId) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "taxpayer failed",
          });
        }
        //create images
        const imbursementProof = await createImbursementProof({
          input,
        });
        const invoiceFromOrg = await createInvoiceFromOrg({
          input,
        });

        const props = {
          invoiceFromOrg,
          input,
          taxPayer,
          txCtx,
          imbursementProof,
          accountId: user.id,
        };

        const imbursement = await createImbursement({
          ...props,
        });

        await createMoneyAccImbursementTx({
          ...props,
          imbursement,
        });

        await createProjectImbursementTx({
          ...props,
          imbursement,
        });
      });
    }),
  // edit executed amount when going from other than accepted
  edit: adminModProcedure
    .input(validateImbursement)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      input.accountId = user.id;

      const taxPayer = await upsertTaxPayer({
        userId: user.id,
        input: input.taxPayer,
      });
      if (!taxPayer || !input.imbursementProof || !input.moneyAccountId) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "taxpayer failed",
        });
      }
      const imbursementProof = await createImbursementProof({ input });

      const createInvoiceFromOrg = async () => {
        if (!input.invoiceFromOrg) return null;

        return await prisma?.searchableImage.upsert({
          where: {
            imageName: input.imbursementProof?.imageName,
          },
          create: {
            accountId: user.id,
            url: input.invoiceFromOrg.url,
            imageName: input.invoiceFromOrg.imageName,
            text: "",
          },
          update: {},
        });
      };
      const invoiceFromOrg = await createInvoiceFromOrg();
      const updatedImbursement = await prisma?.imbursement.update({
        where: { id: input.id },
        data: {
          concept: input.concept,
          projectId: input.projectId,
          wasConvertedToOtherCurrency: input.wasConvertedToOtherCurrency,
          moneyAccountId: input.moneyAccountId,
          taxPayerId: taxPayer.id,
          imbursementProofId: imbursementProof.id,
          invoiceFromOrgId: invoiceFromOrg?.id ?? null,
        },
        include: {
          transactions: { select: { id: true } },
          imbursementProof: { select: { id: true } },
          invoiceFromOrg: { select: { id: true } },
        },
      });

      if (input.projectId) {
        //connect taxpayer to project as a donor.
        await prisma.project.update({
          where: { id: input.projectId },
          data: {
            taxPayer: { connect: { id: taxPayer.id } },
          },
        });
      }
      if (updatedImbursement.imbursementProofId) {
        await prisma.transaction.update({
          where: { id: updatedImbursement.transactions[0]?.id },
          data: {
            searchableImage: {
              connect: { id: updatedImbursement.imbursementProofId },
            },
          },
        });
      }
    }),

  cancelById: adminModProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await prisma.$transaction(async (txCtx) => {
        // Create a transaction that reverses the previous one and reference the new and old one with each other.,
        // Imbursements could have two transactions, one for the imbursement and another for project imbursement.
        const imbursement = await txCtx.imbursement.update({
          where: { id: input.id },
          data: { wasCancelled: true },
          include: { transactions: true },
        });

        //Cancel project imbursement
        await cancelTransactionsAndRevertBalance({
          txCtx,
          transactions: imbursement.transactions,
        });

        return;
      });
    }),
  deleteById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      //TODO check if it can be deleted

      await prisma.transaction.deleteMany({
        where: { imbursementId: input.id },
      });

      const x = await prisma?.imbursement.delete({
        where: { id: input.id },
      });
      return x;
    }),
});
