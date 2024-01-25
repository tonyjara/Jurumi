import { MenuItem } from "@chakra-ui/react";
import React from "react";
import { handleUseMutationAlerts } from "@/components/Toasts & Alerts/MyToast";
import { trpcClient } from "@/lib/utils/trpcClient";
import { MonyRequestCompleteWithApproval } from "./mod.approvals.types";
import { RowOptionsJsonView } from "@/components/DynamicTables/RowOptions/RowOptionsJsonView";
import { useSession } from "next-auth/react";

export const RowOptionApprovals = ({
  x,
  setRequestId,
  setMenuData,
}: {
  x: MonyRequestCompleteWithApproval;
  setRequestId: React.Dispatch<React.SetStateAction<string | null>>;
  setMenuData: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
      rowData: any | null;
    }>
  >;
}) => {
  const context = trpcClient.useContext();
  const session = useSession();
  const isAdmin = session?.data?.user.role === "ADMIN";

  const closeMenu = () => {
    setMenuData((prev) => ({ ...prev, rowData: null }));
  };
  const { mutate: mutateApprove } =
    trpcClient.moneyApprovals.approve.useMutation(
      handleUseMutationAlerts({
        successText: "La solicitud ha sido aprobada!",
        callback: () => {
          context.invalidate();
          closeMenu();
        },
      }),
    );
  const { mutate: mutateAdminApprove } =
    trpcClient.moneyApprovals.adminApprove.useMutation(
      handleUseMutationAlerts({
        successText: "La solicitud ha sido aprobada (ADMIN)!",
        callback: () => {
          context.invalidate();
          closeMenu();
        },
      }),
    );

  const handleApprove = () => {
    mutateApprove({ moneyRequestId: x.id, organizationId: x.organizationId });
  };
  const handleAdminApprove = () => {
    mutateAdminApprove({ moneyRequestId: x.id });
  };

  const hasBeenApproved = x.approvalStatus === "ACCEPTED";
  const hasBeenRejected = x.approvalStatus === "REJECTED";

  return (
    <>
      <RowOptionsJsonView x={x} />
      <MenuItem isDisabled={hasBeenApproved} onClick={handleApprove}>
        Aprobar
      </MenuItem>
      <MenuItem
        isDisabled={hasBeenApproved}
        onClick={handleAdminApprove}
        hidden={!isAdmin}
        background={"orange.500"}
      >
        Aprobar (Admin)
      </MenuItem>
      <MenuItem
        isDisabled={hasBeenRejected}
        onClick={() => {
          setRequestId(x.id);
          closeMenu();
        }}
      >
        Rechazar
      </MenuItem>
    </>
  );
};
