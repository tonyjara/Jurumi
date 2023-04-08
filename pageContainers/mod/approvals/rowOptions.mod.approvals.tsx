import { MenuItem } from "@chakra-ui/react";
import React from "react";
import { handleUseMutationAlerts } from "@/components/Toasts & Alerts/MyToast";
import { trpcClient } from "@/lib/utils/trpcClient";
import type { MoneyRequestCompleteWithApproval } from "./PendingApprovalsPage.mod.approvals";

export const RowOptionApprovals = ({
    x,
    hasBeenApproved,
    needsApproval,
    setRequestId,
    hasBeenRejected,
}: {
    x: MoneyRequestCompleteWithApproval;
    hasBeenApproved: boolean;
    hasBeenRejected: boolean;
    needsApproval: boolean;
    setRequestId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
    const context = trpcClient.useContext();
    const { mutate: mutateApprove } =
        trpcClient.moneyApprovals.approve.useMutation(
            handleUseMutationAlerts({
                successText: "La solicitud ha sido aprobada!",
                callback: () => {
                    context.moneyRequest.invalidate();
                },
            })
        );

    const handleApprove = () => {
        mutateApprove({ moneyRequestId: x.id });
    };

    return (
        <>
            <MenuItem
                isDisabled={!needsApproval || hasBeenApproved}
                onClick={handleApprove}
            >
                Aprobar
            </MenuItem>
            <MenuItem
                isDisabled={hasBeenRejected}
                onClick={() => {
                    setRequestId(x.id);
                }}
            >
                Rechazar
            </MenuItem>
        </>
    );
};
