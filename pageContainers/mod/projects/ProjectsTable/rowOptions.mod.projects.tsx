import { MenuItem } from "@chakra-ui/react";
import React from "react";
import { handleUseMutationAlerts } from "@/components/Toasts & Alerts/MyToast";
import { trpcClient } from "@/lib/utils/trpcClient";
import type { ProjectForTable } from "./ProjectsTable.mod.projects";

const RowOptionsModProjects = ({
  x,
  setEditProject,
  onEditOpen,
  setMenuData,
}: {
  x: ProjectForTable;
  setEditProject: React.Dispatch<React.SetStateAction<ProjectForTable | null>>;
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

  const { mutate: deleteById } = trpcClient.moneyRequest.deleteById.useMutation(
    handleUseMutationAlerts({
      successText: "Se ha eliminado la solicitud!",
      callback: () => {
        context.moneyRequest.getManyComplete.invalidate();
        closeMenu();
      },
    })
  );

  return (
    <>
      <MenuItem
        onClick={() => {
          setEditProject(x);
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

export default RowOptionsModProjects;
