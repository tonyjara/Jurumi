import { MenuItem } from "@chakra-ui/react";
import React from "react";
import { handleUseMutationAlerts } from "@/components/Toasts & Alerts/MyToast";
import { trpcClient } from "@/lib/utils/trpcClient";
import type { FormTaxPayer } from "@/lib/validations/taxtPayer.validate";

const RowOptionsHomeTaxPayers = ({
  x,
  setEditTaxPayer,
  onEditOpen,
  setMenuData,
}: {
  x: FormTaxPayer;
  setEditTaxPayer: React.Dispatch<React.SetStateAction<FormTaxPayer | null>>;
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

  const { mutate: deleteById } = trpcClient.taxPayer.deleteById.useMutation(
    handleUseMutationAlerts({
      successText: "Se ha eliminado el contribuyente!",
      callback: () => {
        context.taxPayer.invalidate();
        closeMenu();
      },
    })
  );

  return (
    <>
      <MenuItem
        onClick={() => {
          setEditTaxPayer(x);
          onEditOpen();
          closeMenu();
        }}
      >
        Editar
      </MenuItem>

      <MenuItem onClick={() => deleteById({ id: x.id })}>Eliminar</MenuItem>
    </>
  );
};

export default RowOptionsHomeTaxPayers;
