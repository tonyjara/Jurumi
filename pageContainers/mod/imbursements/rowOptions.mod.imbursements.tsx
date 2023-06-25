import { MenuItem } from "@chakra-ui/react";
import React from "react";
import { handleUseMutationAlerts } from "@/components/Toasts & Alerts/MyToast";
import { trpcClient } from "@/lib/utils/trpcClient";
import type { imbursementComplete } from "./ImbursementsPage.mod.imbursements";
import type { FormImbursement } from "@/lib/validations/imbursement.validate";
import { RowOptionDeleteDialog } from "@/components/Toasts & Alerts/RowOption.delete.dialog";
import { RowOptionCancelDialog } from "@/components/Toasts & Alerts/RowOptions.cancel.dialog";

const RowOptionsImbursements = ({
  x,
  setEditImbursement,
  onEditOpen,
  setMenuData,
}: {
  x: imbursementComplete;
  setEditImbursement: React.Dispatch<
    React.SetStateAction<FormImbursement | null>
  >;
  onEditOpen: () => void;

  setMenuData: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
      rowData: any | null;
    }>
  >;
}) => {
  const context = trpcClient.useContext();
  const closeMenu = () => {
    setMenuData((prev) => ({ ...prev, rowData: null }));
  };

  const { mutate: deleteById } = trpcClient.imbursement.deleteById.useMutation(
    handleUseMutationAlerts({
      successText: "Se ha eliminado el desembolso!",
      callback: () => {
        context.imbursement.invalidate();
        context.moneyAcc.invalidate();
        closeMenu();
      },
    })
  );

  const { mutate: cancelById } = trpcClient.imbursement.cancelById.useMutation(
    handleUseMutationAlerts({
      successText: "Se ha anulado la transaccion!",
      callback: () => {
        context.imbursement.invalidate();
        context.moneyAcc.invalidate();
        context.transaction.invalidate();
        closeMenu();
      },
    })
  );
  return (
    <>
      {!!x.wasCancelled && <MenuItem>Este desembolso fue anulado.</MenuItem>}
      <MenuItem
        onClick={() => {
          setEditImbursement(x);
          onEditOpen();
          closeMenu();
        }}
        isDisabled={x.wasCancelled}
      >
        Editar
      </MenuItem>
      <RowOptionCancelDialog
        isDisabled={x.wasCancelled}
        targetName="desembolso"
        onConfirm={() => cancelById({ id: x.id })}
      />
      <RowOptionDeleteDialog
        targetName="desembolso"
        onConfirm={() => deleteById({ id: x.id })}
      />
    </>
  );
};

export default RowOptionsImbursements;
