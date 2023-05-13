import { MenuItem } from "@chakra-ui/react";
import React from "react";
import { handleUseMutationAlerts } from "@/components/Toasts & Alerts/MyToast";
import { trpcClient } from "@/lib/utils/trpcClient";
import { MoneyAccountOffsetComplete } from "./MoneyAccountOffsetsPage.mod.money-account-offset";

const RowOptionsMoneyAccountOffset = ({
  x,
}: {
  x: MoneyAccountOffsetComplete;
}) => {
  const context = trpcClient.useContext();

  const { mutate: deleteById } =
    trpcClient.moneyAcc.deleteMoneyAccountOffsetById.useMutation(
      handleUseMutationAlerts({
        successText: "Se ha eliminado la el ajuste!",
        callback: () => {
          context.invalidate();
        },
      })
    );
  const { mutate: cancelById } =
    trpcClient.moneyAcc.cancelMoneyAccountOffsetById.useMutation(
      handleUseMutationAlerts({
        successText: "Se ha anulado el ajuste!",
        callback: () => {
          context.invalidate();
        },
      })
    );

  return (
    <div>
      <MenuItem
        onClick={() => {
          cancelById({ id: x.id });
        }}
      >
        Anular
      </MenuItem>

      <MenuItem
        onClick={() => {
          if (!x.transactions[0]) return;
          deleteById({ transactionId: x.transactions[0].id, id: x.id });
        }}
      >
        Eliminar
      </MenuItem>
    </div>
  );
};

export default RowOptionsMoneyAccountOffset;
