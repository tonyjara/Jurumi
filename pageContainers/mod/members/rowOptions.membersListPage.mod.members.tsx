import { MenuItem } from "@chakra-ui/react";
import React from "react";
import { handleUseMutationAlerts } from "@/components/Toasts & Alerts/MyToast";
import { trpcClient } from "@/lib/utils/trpcClient";
import type { CompleteMember } from "./MembersListPage.mod.members";

const RowOptiosnMembersListPage = ({
    x,
    setEditMember,
    onEditOpen,
}: {
    onEditOpen: () => void;
    setEditMember: React.Dispatch<React.SetStateAction<CompleteMember | null>>;
    x: CompleteMember;
}) => {
    const context = trpcClient.useContext();

    const { mutate } = trpcClient.account.toggleActivation.useMutation(
        handleUseMutationAlerts({
            successText: "Se ha modificado la cuenta!",
            callback: () => {
                context.account.getMany.invalidate();
            },
        })
    );

    return (
        <>
            <MenuItem
                onClick={() => {
                    mutate({ id: x.id, active: !x.active });
                }}
            >
                {x.active ? "Desactivar cuenta" : "Activar cuenta"}
            </MenuItem>
            <MenuItem
                onClick={() => {
                    setEditMember(x);
                    onEditOpen();
                }}
            >
                Editar
            </MenuItem>
        </>
    );
};

export default RowOptiosnMembersListPage;
