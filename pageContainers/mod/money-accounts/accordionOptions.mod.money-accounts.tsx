import { handleUseMutationAlerts } from "@/components/Toasts & Alerts/MyToast";
import { trpcClient } from "@/lib/utils/trpcClient";
import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import type { MoneyAccount } from "@prisma/client";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import type { MoneyAccWithTransactions } from "./MoneyAccountsPage.mod.money-accounts";

const AccordionOptionsMoneyAccountsPage = ({
  setEditData,
  accountData,
  onOffsetOpen,
  setOffsetData,
}: {
  setEditData: React.Dispatch<React.SetStateAction<MoneyAccount | null>>;
  accountData: MoneyAccWithTransactions;
  onOffsetOpen: () => void;
  setOffsetData: React.Dispatch<
    React.SetStateAction<MoneyAccWithTransactions | null>
  >;
}) => {
  const context = trpcClient.useContext();

  const { mutate: deleteById } = trpcClient.moneyAcc.deleteById.useMutation(
    handleUseMutationAlerts({
      successText: "Se ha eliminado la cuenta!",
      callback: () => {
        context.transaction.invalidate();
        context.moneyAcc.invalidate();
      },
    })
  );

  return (
    <div>
      <Menu>
        <MenuButton
          onClick={(e) => e.stopPropagation()}
          as={IconButton}
          aria-label="options button"
          icon={<BsThreeDots />}
        />
        <MenuList>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              setEditData(accountData);
            }}
          >
            Editar
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              setOffsetData(accountData);
              onOffsetOpen();
            }}
          >
            Generar Ajuste
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              deleteById({
                id: accountData.id,
              });
            }}
          >
            Eliminar
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};

export default AccordionOptionsMoneyAccountsPage;
