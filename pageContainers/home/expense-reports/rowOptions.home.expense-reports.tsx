import { MenuItem } from "@chakra-ui/react";
import React from "react";
import { handleUseMutationAlerts } from "@/components/Toasts & Alerts/MyToast";
import { trpcClient } from "@/lib/utils/trpcClient";
import { RowOptionDeleteDialog } from "@/components/Toasts & Alerts/RowOption.delete.dialog";
import { RowOptionCancelDialog } from "@/components/Toasts & Alerts/RowOptions.cancel.dialog";
import { HomeExpenseReportComplete } from "@/pageContainers/mod/requests/expenseReport.types";

const RowOptionsHomeExpenseReports = ({
  x,
  setEditExpenseReport,
  onEditOpen,
  setMenuData,
}: {
  x: HomeExpenseReportComplete;
  setEditExpenseReport: React.Dispatch<
    React.SetStateAction<HomeExpenseReportComplete | null>
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

  const { mutate: cancelById } =
    trpcClient.expenseReport.cancelById.useMutation(
      handleUseMutationAlerts({
        successText: "Se ha anulado su rendición",
        callback: () => {
          context.expenseReport.invalidate();
          closeMenu();
        },
      })
    );
  const { mutate: deleteById } =
    trpcClient.expenseReport.deleteById.useMutation(
      handleUseMutationAlerts({
        successText: "Se ha eliminado su rendición",
        callback: () => {
          context.expenseReport.invalidate();
          closeMenu();
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

export default RowOptionsHomeExpenseReports;
