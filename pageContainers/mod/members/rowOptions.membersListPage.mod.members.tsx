import { MenuItem } from "@chakra-ui/react";
import React from "react";
import { handleUseMutationAlerts } from "@/components/Toasts & Alerts/MyToast";
import { trpcClient } from "@/lib/utils/trpcClient";
import type { CompleteMember } from "./MembersListPage.mod.members";

const RowOptiosnMembersListPage = ({
  x,
  setEditMember,
  onEditOpen,
  setMenuData,
}: {
  onEditOpen: () => void;
  setEditMember: React.Dispatch<React.SetStateAction<CompleteMember | null>>;
  x: CompleteMember;

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
          setEditMember(x);
          onEditOpen();
          closeMenu();
        }}
      >
        Editar
      </MenuItem>
    </>
  );
};

export default RowOptiosnMembersListPage;
