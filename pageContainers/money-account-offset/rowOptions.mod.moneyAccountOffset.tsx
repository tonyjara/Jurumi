import { MenuItem } from "@chakra-ui/react";
import React from "react";
import { handleUseMutationAlerts } from "@/components/Toasts & Alerts/MyToast";
import { trpcClient } from "@/lib/utils/trpcClient";
import { MoneyAccountOffsetComplete } from "./MoneyAccountOffsetsPage.mod.money-account-offset";

const RowOptionsMoneyAccountOffset = ({
  x,
  setMenuData,
}: {
  x: MoneyAccountOffsetComplete;
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

  /* const { mutate: deleteById } = */
  /*   trpcClient.moneyAcc.deleteMoneyAccountOffsetById.useMutation( */
  /*     handleUseMutationAlerts({ */
  /*       successText: "Se ha eliminado la el ajuste!", */
  /*       callback: () => { */
  /*         context.invalidate(); */
  /*         closeMenu(); */
  /*       }, */
  /*     }), */
  /*   ); */
  const { mutate: cancelById } =
    trpcClient.moneyAcc.cancelMoneyAccountOffsetById.useMutation(
      handleUseMutationAlerts({
        successText: "Se ha anulado el ajuste!",
        callback: () => {
          context.invalidate();
          closeMenu();
        },
      }),
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

      {/* <MenuItem */}
      {/*   onClick={() => { */}
      {/*     if (!x.transactions[0]) return; */}
      {/*     deleteById({ transactionId: x.transactions[0].id, id: x.id }); */}
      {/*   }} */}
      {/* > */}
      {/*   Eliminar */}
      {/* </MenuItem> */}
    </div>
  );
};

export default RowOptionsMoneyAccountOffset;
