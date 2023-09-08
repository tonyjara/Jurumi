import { z } from "zod";
import { validateExpenseReport } from "@/lib/validations/expenseReport.validate";
import {
    adminModObserverProcedure,
    adminProcedure,
    protectedProcedure,
    router,
} from "../initTrpc";
import prisma from "@/server/db/client";
import {
    createCostCategoryTransactions,
    upsertExpenseReportSearchableImage,
    createReimbursementRequestBasedOnExpenseReport,
} from "./utils/ExpenseReport.routeUtils";
import { upsertTaxPayer } from "./utils/TaxPayer.routeUtils";
import {
    completeHomeExpenseReportsArgs,
    completeModExpenseReportsArgs,
} from "@/pageContainers/mod/requests/expenseReport.types";
import { cancelTransactionsAndRevertBalance } from "./utils/Cancelations.routeUtils";
import { appRouter } from "./router";

export const expenseReportsRouter = router({
    getMany: protectedProcedure.query(async ({ ctx }) => {
        const user = ctx.session.user;
        return await prisma?.expenseReport.findMany({
            take: 20,
            orderBy: { createdAt: "desc" },
            where: {
                accountId: user.id,
            },
        });
    }),
    count: protectedProcedure
        .input(
            z.object({
                whereFilterList: z.any().array().optional(),
            })
        )
        .query(async ({ input }) =>
            prisma?.expenseReport.count({
                where: {
                    searchableImage: { isNot: null },
                    AND: [...(input?.whereFilterList ?? [])],
                },
            })
        ),
    getMyOwnComplete: protectedProcedure
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
        .query(async ({ ctx, input }) => {
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

            return await prisma?.expenseReport.findMany({
                where: {
                    searchableImage: { isNot: null },
                    AND: [...(input?.whereFilterList ?? []), { accountId: user.id }],
                },
                take: pageSize,
                skip: pageIndex * pageSize,
                orderBy: handleOrderBy(),
                ...completeHomeExpenseReportsArgs,
            });
        }),
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

            return await prisma?.expenseReport.findMany({
                take: pageSize,
                skip: pageIndex * pageSize,
                orderBy: handleOrderBy(),
                where: {
                    searchableImage: { isNot: null },
                    AND: [...(input?.whereFilterList ?? [])],
                },
                ...completeModExpenseReportsArgs,
            });
        }),
    findCompleteModById: adminModObserverProcedure
        .input(
            z.object({
                ids: z.string().array(),

                whereFilterList: z.any().array().optional(),
            })
        )
        .query(async ({ input }) => {
            if (!input.ids.length) return null;
            return await prisma?.expenseReport.findMany({
                where: {
                    searchableImage: { isNot: null },
                    AND: [...(input?.whereFilterList ?? []), { id: { in: input.ids } }],
                },
                ...completeModExpenseReportsArgs,
            });
        }),
    create: protectedProcedure
        .input(validateExpenseReport)
        .mutation(async ({ input, ctx }) => {
            const user = ctx.session.user;
            input.accountId = user.id; // needed for searchable image

            const taxPayer = await upsertTaxPayer({
                input: {
                    razonSocial: input.taxPayer.razonSocial,
                    ruc: input.taxPayer.ruc,
                    bankInfo: null,
                },
                userId: user.id,
            });

            const upsertSearchableImage = await upsertExpenseReportSearchableImage({
                input,
            });

            const expenseReport = await prisma.$transaction(
                async (txCtx) => {
                    const postExpenseReport = await txCtx?.expenseReport.create({
                        data: {
                            accountId: user.id,
                            concept: input.concept,
                            facturaNumber: input.facturaNumber,
                            amountSpent: input.amountSpent,
                            comments: input.comments,
                            currency: input.currency,
                            costCategoryId: input.costCategoryId,
                            moneyRequestId: input.moneyRequestId,
                            taxPayerId: taxPayer?.id,
                            projectId: input.projectId,
                            exchangeRate: input.exchangeRate,
                            wasConvertedToOtherCurrency: input.wasConvertedToOtherCurrency,
                            searchableImage: {
                                connect: { id: upsertSearchableImage.id },
                            },
                        },
                        include: {
                            account: { select: { id: true } },
                            searchableImage: true,
                            taxPayer: true,
                        },
                    });

                    await createCostCategoryTransactions({
                        expenseReport: postExpenseReport,
                        txCtx,
                    });
                    return postExpenseReport;
                },
                { timeout: 30000 }
            );

            await createReimbursementRequestBasedOnExpenseReport({
                input,
                ctx,
                expenseReport,
            });
        }),
    edit: protectedProcedure
        .input(validateExpenseReport)
        .mutation(async ({ input, ctx }) => {
            try {
                const caller = appRouter.createCaller({ session: ctx.session });
                await caller.expenseReport.cancelById({ id: input.id });
                await caller.expenseReport.create(input);

            } catch (err) {
                console.error(err);
            }
        }),

    cancelById: protectedProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            return await prisma.$transaction(async (txCtx) => {
                const expenseReport = await txCtx.expenseReport.update({
                    where: { id: input.id },
                    data: { wasCancelled: true, facturaNumber: null },
                    include: { transactions: true },
                });
                await cancelTransactionsAndRevertBalance({
                    transactions: expenseReport.transactions,
                    txCtx,
                });

                return expenseReport;
            });
        }),
    deleteById: adminProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            const x = await prisma?.expenseReport.delete({
                where: { id: input.id },
            });
            return x;
        }),
});
