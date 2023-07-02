import { MenuItem } from "@chakra-ui/react";
import React from "react";
import { handleUseMutationAlerts } from "@/components/Toasts & Alerts/MyToast";
import { trpcClient } from "@/lib/utils/trpcClient";
import { RowOptionDeleteDialog } from "@/components/Toasts & Alerts/RowOption.delete.dialog";
import { RowOptionCancelDialog } from "@/components/Toasts & Alerts/RowOptions.cancel.dialog";
import { ExpenseReturnComplete } from "./ModExpenseReturnsPage.mod.expense-returns";

const RowOptionsHomeExpenseReturns = ({
  x,
  setEditExpenseReturn,
  onEditOpen,
  setMenuData,
}: {
  x: ExpenseReturnComplete;
  setEditExpenseReturn: React.Dispatch<
    React.SetStateAction<ExpenseReturnComplete | null>
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
    setMenuData((prev) => ({ ...prev, menuData: null }));
  };

  const { mutate: cancelById } =
    trpcClient.expenseReturn.cancelById.useMutation(
      handleUseMutationAlerts({
        successText: "Se ha anulado su devolución",
        callback: () => {
          context.expenseReturn.invalidate();
          closeMenu();
        },
      })
    );
  const { mutate: deleteById } =
    trpcClient.expenseReturn.deleteById.useMutation(
      handleUseMutationAlerts({
        successText: "Se ha eliminado su devolución",
        callback: () => {
          context.expenseReturn.invalidate();
          closeMenu();
        },
      })
    );

  return (
    <>
      <MenuItem
        isDisabled={x.wasCancelled}
        onClick={() => {
          setEditExpenseReturn(x);
          onEditOpen();
          closeMenu();
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

export default RowOptionsHomeExpenseReturns;
