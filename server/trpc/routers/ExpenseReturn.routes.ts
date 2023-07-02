import { z } from "zod";
import {
    adminModObserverProcedure,
    adminProcedure,
    protectedProcedure,
    router,
} from "../initTrpc";
import prisma from "@/server/db/client";
import { validateExpenseReturn } from "@/lib/validations/expenseReturn.validate";
import { expenseReturnCreateUtils } from "./utils/ExpenseReturn.routeUtils";
import { TRPCError } from "@trpc/server";

export const expenseReturnsRouter = router({
    create: protectedProcedure
        .input(validateExpenseReturn)
        .mutation(async ({ input, ctx }) => {
            const user = ctx.session.user;
            input.accountId = user.id;

            await prisma.$transaction(async (txCtx) => {
                const imageProof =
                    await expenseReturnCreateUtils.createExpenseReportProof({
                        input,
                        txCtx,
                    });
                if (!imageProof) {
                    throw new TRPCError({
                        code: "PRECONDITION_FAILED",
                        message: "no imbursement proof",
                    });
                }

                const expenseReturn = await txCtx?.expenseReturn.create({
                    data: {
                        currency: input.currency,
                        exchangeRate: input.exchangeRate,
                        wasConvertedToOtherCurrency: input.wasConvertedToOtherCurrency,
                        amountReturned: input.amountReturned,
                        moneyAccountId: input.moneyAccountId,
                        moneyRequestId: input.moneyRequestId,
                        accountId: user.id,
                        searchableImage: { connect: { id: imageProof.id } },
                    },
                    include: { searchableImage: { select: { id: true } } },
                });

                await expenseReturnCreateUtils.createMoneyAccountTx({
                    txCtx,
                    expenseReturn,
                    accountId: user.id,
                });
            });
        }),

    edit: protectedProcedure
        .input(validateExpenseReturn)
        .mutation(async ({ input, ctx }) => {
            try {
                const user = ctx.session.user;
                const x = await prisma?.expenseReturn.update({
                    where: { id: input.id },
                    data: {
                        accountId: user.id,
                        amountReturned: input.amountReturned,
                        currency: input.currency,
                        moneyRequestId: input.moneyRequestId,
                        searchableImage: {
                            upsert: {
                                create: {
                                    url: input.searchableImage.url,
                                    imageName: input.searchableImage.imageName,
                                    text: "",
                                },
                                update: {
                                    url: input.searchableImage.url,
                                },
                            },
                        },
                    },
                });

                return x;
            } catch (err) {
                console.error(err);
            }
        }),
    count: protectedProcedure
        .input(
            z.object({
                whereFilterList: z.any().array().optional(),
            })
        )
        .query(async ({ input }) =>
            prisma?.expenseReturn.count({
                where: {
                    AND: [...(input?.whereFilterList ?? [])],
                },
            })
        ),
    getManyComplete: adminModObserverProcedure
        .input(
            z.object({
                pageIndex: z.number().nullish(),
                pageSize: z.number().min(1).max(100).nullish(),
                sorting: z
                    .object({ id: z.string(), desc: z.boolean() })
                    .array()
                    .nullish(),
                whereFilterList: z.any().array().optional(),
            })
        )
        .query(async ({ input }) => {
            const pageSize = input.pageSize ?? 10;
            const pageIndex = input.pageIndex ?? 0;

            //splits nested objects
            const handleOrderBy = () => {
                if (input.sorting && input.sorting[0]) {
                    const prop = input.sorting[0];
                    if (prop.id.includes("_")) {
                        const split = prop.id.split("_");
                        return {
                            [split[0] as string]: {
                                [split[1] as string]: prop.desc ? "desc" : "asc",
                            },
                        };
                    }
                    return { [prop.id]: prop.desc ? "desc" : "asc" };
                }
                return { createdAt: "desc" } as any;
            };

            return await prisma?.expenseReturn.findMany({
                take: pageSize,
                skip: pageIndex * pageSize,
                orderBy: handleOrderBy(),
                where: {
                    AND: [...(input?.whereFilterList ?? [])],
                },
                include: {
                    account: { select: { displayName: true, id: true } },
                    searchableImage: { select: { url: true, imageName: true } },
                },
            });
        }),
    countMyOwn: protectedProcedure
        .input(
            z.object({
                whereFilterList: z.any().array().optional(),
            })
        )
        .query(async ({ input, ctx }) => {
            const user = ctx.session.user;
            return await prisma?.expenseReturn.count({
                where: {
                    AND: [...(input?.whereFilterList ?? []), { accountId: user.id }],
                },
            })
        }),

    getMyOwnComplete: adminModObserverProcedure
        .input(
            z.object({
                pageIndex: z.number().nullish(),
                pageSize: z.number().min(1).max(100).nullish(),
                sorting: z
                    .object({ id: z.string(), desc: z.boolean() })
                    .array()
                    .nullish(),
                whereFilterList: z.any().array().optional(),
            })
        )
        .query(async ({ input, ctx }) => {
            const user = ctx.session.user;
            const pageSize = input.pageSize ?? 10;
            const pageIndex = input.pageIndex ?? 0;

            //splits nested objects
            const handleOrderBy = () => {
                if (input.sorting && input.sorting[0]) {
                    const prop = input.sorting[0];
                    if (prop.id.includes("_")) {
                        const split = prop.id.split("_");
                        return {
                            [split[0] as string]: {
                                [split[1] as string]: prop.desc ? "desc" : "asc",
                            },
                        };
                    }
                    return { [prop.id]: prop.desc ? "desc" : "asc" };
                }
                return { createdAt: "desc" } as any;
            };

            return await prisma?.expenseReturn.findMany({
                take: pageSize,
                skip: pageIndex * pageSize,
                orderBy: handleOrderBy(),
                where: {
                    AND: [...(input?.whereFilterList ?? []), { accountId: user.id }],
                },
                include: {
                    account: { select: { displayName: true, id: true } },
                    searchableImage: { select: { url: true, imageName: true } },
                },
            });
        }),



    findCompleteById: adminModObserverProcedure
        .input(
            z.object({
                ids: z.string().array(),
                whereFilterList: z.any().array().optional(),
            })
        )
        .query(async ({ input }) => {
            if (!input.ids.length) return null;
            return await prisma?.expenseReturn.findMany({
                where: {
                    AND: [...(input?.whereFilterList ?? []), { id: { in: input.ids } }],
                },
                include: {
                    account: { select: { displayName: true, id: true } },
                    searchableImage: { select: { url: true, imageName: true } },
                },
            });
        }),
    cancelById: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            const x = await prisma?.expenseReturn.update({
                where: { id: input.id },
                data: { wasCancelled: true },
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
            const x = await prisma?.expenseReturn.delete({
                where: { id: input.id },
            });
            return x;
        }),
});
