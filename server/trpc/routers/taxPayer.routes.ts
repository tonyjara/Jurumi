import { z } from "zod";
import { validateTaxPayer } from "@/lib/validations/taxtPayer.validate";
import { adminProcedure, router, protectedProcedure } from "../initTrpc";
import { handleOrderBy } from "./utils/Sorting.routeUtils";
import prisma from "@/server/db/client";

export const taxPayerRouter = router({
  count: protectedProcedure.query(async () => {
    return await prisma?.taxPayer.count();
  }),
  getMany: protectedProcedure
    .input(
      z.object({
        pageIndex: z.number().nullish(),
        pageSize: z.number().min(1).max(100).nullish(),
        sorting: z
          .object({ id: z.string(), desc: z.boolean() })
          .array()
          .nullish(),
      }),
    )
    .query(async ({ input }) => {
      const pageSize = input.pageSize ?? 10;
      const pageIndex = input.pageIndex ?? 0;

      return await prisma?.taxPayer.findMany({
        take: pageSize,
        skip: pageIndex * pageSize,
        orderBy: handleOrderBy({ input }),
        include: { bankInfo: true },
      });
    }),
  findFullTextSearch: protectedProcedure
    .input(z.object({ searchValue: z.string(), filterValue: z.string() }))
    .query(async ({ input }) => {
      return await prisma?.taxPayer.findMany({
        take: 20,
        orderBy: { razonSocial: "asc" },
        include: { bankInfo: true },
        where: {
          ruc:
            input.filterValue === "ruc" ? { contains: input.searchValue } : {},
          razonSocial:
            input.filterValue === "razonSocial"
              ? { contains: input.searchValue, mode: "insensitive" }
              : {},
        },
      });
    }),

  create: protectedProcedure
    .input(validateTaxPayer)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;

      const x = await prisma?.taxPayer.create({
        data: {
          createdById: user.id,
          razonSocial: input.razonSocial,
          ruc: input.ruc,
          fantasyName: input.fantasyName,
          bankInfo: {
            create:
              //PATCH FOR UNIQUE CONSTRAINT
              input.bankInfo && input.bankInfo.accountNumber
                ? {
                    bankName: input.bankInfo?.bankName,
                    accountNumber: input.bankInfo?.accountNumber,
                    ownerName: input.bankInfo?.ownerName,
                    ownerDocType: input.bankInfo?.ownerDocType,
                    ownerDoc: input.bankInfo?.ownerDoc,
                    type: input.bankInfo?.type,
                  }
                : undefined,
          },
        },
      });
      return x;
    }),
  createIfNotExist: protectedProcedure
    .input(z.object({ razonSocial: z.string(), ruc: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;

      const x = await prisma?.taxPayer.upsert({
        where: {
          ruc: input.ruc,
        },
        create: {
          createdById: user.id,
          razonSocial: input.razonSocial,
          ruc: input.ruc,
        },
        update: {},
      });
      return x;
    }),
  edit: protectedProcedure
    .input(validateTaxPayer)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;

      const x = await prisma?.taxPayer.update({
        where: { id: input.id },
        data: {
          updatedById: user.id,
          razonSocial: input.razonSocial,
          ruc: input.ruc,
          fantasyName: input.fantasyName,
          bankInfo: {
            upsert: {
              create: {
                bankName: input.bankInfo?.bankName ?? "BANCOP",
                accountNumber: input.bankInfo?.accountNumber ?? "",
                ownerName: input.bankInfo?.ownerName ?? "",
                ownerDocType: input.bankInfo?.ownerDocType ?? "CI",
                ownerDoc: input.bankInfo?.ownerDoc ?? "",
                type: input.bankInfo?.type ?? "CURRENT",
              },

              update: {
                bankName: input.bankInfo?.bankName,
                accountNumber: input.bankInfo?.accountNumber,
                ownerName: input.bankInfo?.ownerName,
                ownerDocType: input.bankInfo?.ownerDocType,
                ownerDoc: input.bankInfo?.ownerDoc,
                type: input.bankInfo?.type,
              },
            },
          },
        },
      });
      return x;
    }),
  deleteById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const org = await prisma?.taxPayer.delete({
        where: { id: input.id },
      });
      return org;
    }),
});
