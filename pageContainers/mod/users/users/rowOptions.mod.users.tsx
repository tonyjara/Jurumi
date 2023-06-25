import { MenuItem } from "@chakra-ui/react";
import type { Account } from "@prisma/client";
import React from "react";
import { handleUseMutationAlerts } from "@/components/Toasts & Alerts/MyToast";
import { trpcClient } from "@/lib/utils/trpcClient";
import type { FormAccount } from "@/lib/validations/account.validate";

const RowOptionsModUsers = ({
  x,
  setEditAccount,
  onEditOpen,
  setMenuData,
}: {
  onEditOpen: () => void;
  setEditAccount: React.Dispatch<React.SetStateAction<FormAccount | null>>;
  x: Account;
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

  const { mutate } = trpcClient.account.toggleActivation.useMutation(
    handleUseMutationAlerts({
      successText: "Se ha modificado la cuenta!",
      callback: () => {
        context.account.getMany.invalidate();
        closeMenu();
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
          setEditAccount(x);
          onEditOpen();
          closeMenu();
        }}
      >
        Editar
      </MenuItem>
    </>
  );
};

export default RowOptionsModUsers;
