import type { Account } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import DateCell from "@/components/DynamicTables/DynamicCells/DateCell";
import EnumTextCell from "@/components/DynamicTables/DynamicCells/EnumTextCell";
import MoneyCell from "@/components/DynamicTables/DynamicCells/MoneyCell";
import PercentageCell, {
    percentageCellUtil,
} from "@/components/DynamicTables/DynamicCells/PercentageCell";
import TextCell from "@/components/DynamicTables/DynamicCells/TextCell";
import { ApprovalUtils } from "@/lib/utils/ApprovalUtilts";
import {
    reduceExpenseReports,
    reduceExpenseReturns,
    reduceTransactionAmounts,
} from "@/lib/utils/TransactionUtils";
import {
    translatedMoneyReqStatus,
    translatedMoneyReqType,
} from "@/lib/utils/TranslatedEnums";
import type { MoneyRequestComplete } from "./MoneyRequestsPage.mod.requests";
import { Center } from "@chakra-ui/react";
import SearchableImageModalCell from "@/components/DynamicTables/DynamicCells/SearchableImagesModalCell";

const columnHelper = createColumnHelper<MoneyRequestComplete>();

export const moneyRequestsColumns = ({
    user,
    pageIndex,
    pageSize,
}: {
    user: Omit<Account, "password"> | undefined;
    pageSize: number;
    pageIndex: number;
}) => [
        columnHelper.display({
            cell: (x) => x.row.index + 1 + pageIndex * pageSize,
            header: "N.",
        }),
        columnHelper.accessor("createdAt", {
            cell: (x) => <DateCell date={x.getValue()} />,
            header: "Fecha de C.",
            sortingFn: "datetime",
        }),
        columnHelper.display({
            cell: (x) => {
                const { needsApproval, approvalText, approverNames } = ApprovalUtils(
                    x.getValue() as any,
                    user
                );
                return (
                    <TextCell
                        text={needsApproval() ? approvalText : "No req."}
                        hover={approverNames}
                    />
                );
            },
            header: "Aprobación",
        }),
        columnHelper.accessor("status", {
            header: "Estado",
            cell: (x) => (
                <EnumTextCell
                    text={x.getValue()}
                    enumFunc={translatedMoneyReqStatus}
                    hover={x.row.original.rejectionMessage}
                />
            ),
        }),
        columnHelper.accessor("moneyRequestType", {
            header: "Tipo",
            cell: (x) => (
                <EnumTextCell text={x.getValue()} enumFunc={translatedMoneyReqType} />
            ),
        }),
        columnHelper.accessor("amountRequested", {
            header: "Monto",
            cell: (x) => (
                <MoneyCell amount={x.getValue()} currency={x.row.original.currency} />
            ),
        }),
        columnHelper.accessor("account.displayName", {
            header: "Creador",
            cell: (x) => <TextCell text={x.getValue()} />,
        }),
        columnHelper.display({
            header: "Proyecto",
            cell: (x) => (
                <TextCell text={x.row.original?.project?.displayName ?? "-"} />
            ),
        }),
        columnHelper.display({
            cell: (x) => (
                <TextCell text={x.row.original.costCategory?.displayName ?? "-"} />
            ),
            header: "L. Presup.",
        }),
        columnHelper.accessor("description", {
            cell: (x) => (
                <TextCell text={x.getValue()} shortenString hover={x.getValue()} />
            ),
            header: "Concepto",
        }),
        columnHelper.accessor("comments", {
            cell: (x) => (
                <TextCell
                    text={x.getValue().length ? x.getValue() : "-"}
                    shortenString
                    hover={x.getValue()}
                />
            ),
            header: "Comentarios",
        }),
        columnHelper.display({
            header: "Ejecutado",
            cell: (x) => (
                <PercentageCell
                    total={x.row.original.amountRequested}
                    executed={reduceTransactionAmounts(x.row.original.transactions)}
                    currency={x.row.original.currency}
                />
            ),
        }),
        columnHelper.accessor(
            (row) => {
                const total = row.amountRequested;
                const executed = reduceExpenseReports(row.expenseReports).add(
                    reduceExpenseReturns(row.expenseReturns)
                );

                return percentageCellUtil(executed, total);
            },
            {
                id: "no-global-sort",
                header: "Rendido",

                cell: (x) => {
                    const total = x.row.original.amountRequested;
                    const executed = reduceExpenseReports(
                        x.row.original.expenseReports
                    ).add(reduceExpenseReturns(x.row.original.expenseReturns));
                    return (
                        <Center>
                            {x.row.original.moneyRequestType === "REIMBURSMENT_ORDER" ? (
                                <SearchableImageModalCell
                                    searchableImages={x.row.original.searchableImages}
                                />
                            ) : (
                                <PercentageCell
                                    total={total}
                                    executed={executed}
                                    currency={x.row.original.currency}
                                />
                            )}
                        </Center>
                    );
                },
            }
        ),
    ];
