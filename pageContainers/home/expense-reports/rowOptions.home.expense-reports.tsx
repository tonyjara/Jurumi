import { MenuItem } from "@chakra-ui/react";
import React from "react";
import { handleUseMutationAlerts } from "@/components/Toasts & Alerts/MyToast";
import { trpcClient } from "@/lib/utils/trpcClient";
import type { MyExpenseReport } from "./ExpenseReportsPage.home.expense-reports";
import { RowOptionDeleteDialog } from "@/components/Toasts & Alerts/RowOption.delete.dialog";
import { RowOptionCancelDialog } from "@/components/Toasts & Alerts/RowOptions.cancel.dialog";

const RowOptionsHomeExpenseReports = ({
    x,
    setEditExpenseReport,
    onEditOpen,
}: {
    x: MyExpenseReport;
    setEditExpenseReport: React.Dispatch<
        React.SetStateAction<MyExpenseReport | null>
    >;
    onEditOpen: () => void;
}) => {
    const context = trpcClient.useContext();

    const { mutate: cancelById } =
        trpcClient.expenseReport.cancelById.useMutation(
            handleUseMutationAlerts({
                successText: "Se ha anulado su rendición",
                callback: () => {
                    context.expenseReport.invalidate();
                },
            })
        );
    const { mutate: deleteById } =
        trpcClient.expenseReport.deleteById.useMutation(
            handleUseMutationAlerts({
                successText: "Se ha eliminado su rendición",
                callback: () => {
                    context.expenseReport.invalidate();
                },
            })
        );

    return (
        <>
            <MenuItem
                isDisabled={x.wasCancelled}
                onClick={() => {
                    setEditExpenseReport(x);
                    onEditOpen();
                }}
            >
                Editar
            </MenuItem>

            <RowOptionCancelDialog
                isDisabled={x.wasCancelled}
                targetName="rendición"
                onConfirm={() => cancelById({ id: x.id })}
            />
            <RowOptionDeleteDialog
                targetName="rendición"
                onConfirm={() => deleteById({ id: x.id })}
            />
        </>
    );
};

export default RowOptionsHomeExpenseReports;
