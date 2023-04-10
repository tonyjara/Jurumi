import {
    Menu,
    MenuButton,
    IconButton,
    MenuList,
    MenuItem,
} from "@chakra-ui/react";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import {
    handleUseMutationAlerts,
    myToast,
} from "@/components/Toasts & Alerts/MyToast";
import { trpcClient } from "@/lib/utils/trpcClient";
import type { VerificationLinksWithAccountName } from "./VerifyLinksPage.mod.users";
import type { Account } from "@prisma/client";

const RowOptionsVerificationLinks = ({
    x,
    user,
}: {
    x: VerificationLinksWithAccountName;
    user:
    | (Omit<Account, "password"> & {
        profile: {
            avatarUrl: string;
        } | null;
    })
    | undefined;
}) => {
    const context = trpcClient.useContext();

    const { mutate } = trpcClient.magicLinks.generateVerificationLink.useMutation(
        handleUseMutationAlerts({
            successText: "Se ha generado otro link y enviado al correo del usuario!",
            callback: () => {
                context.magicLinks.getVerificationLinks.invalidate();
            },
        })
    );

    return (
        <>
            <MenuItem
                isDisabled={user?.role !== "ADMIN"}
                onClick={() => {
                    if (x.hasBeenUsed) {
                        return myToast.error(
                            "La cuenta ya fue activada, no puede generarse otro link."
                        );
                    }
                    mutate({ email: x.email, displayName: x.account.displayName });
                }}
            >
                Generar nuevo link para este correo.
            </MenuItem>
        </>
    );
};

export default RowOptionsVerificationLinks;
