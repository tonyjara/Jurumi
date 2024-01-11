import { handleUseMutationAlerts } from "@/components/Toasts & Alerts/MyToast";
import { trpcClient } from "@/lib/utils/trpcClient";
import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GetManyContractsType } from "./Contract.types";
import { RowOptionsJsonView } from "@/components/DynamicTables/RowOptions/RowOptionsJsonView";
import { useSession } from "next-auth/react";
import { FormMoneyRequest } from "@/lib/validations/moneyRequest.validate";
import { transformContractToFormMoneyRequest } from "./ContractsUtils";

const ContractAccordionOptions = ({
  contract,
  setEditData,
  setNewRequestData,
  setConnectContractData,
}: {
  contract: GetManyContractsType;
  setEditData: React.Dispatch<GetManyContractsType | null>;
  setNewRequestData: React.Dispatch<FormMoneyRequest | null>;
  setConnectContractData: React.Dispatch<GetManyContractsType | null>;
}) => {
  const user = useSession().data?.user;
  const isAdmin = user?.role === "ADMIN";
  const context = trpcClient.useContext();

  const { data: prefs } = trpcClient.preferences.getMyPreferences.useQuery();
  const { mutate: deleteById } = trpcClient.contracts.deleteById.useMutation(
    handleUseMutationAlerts({
      successText: "Se ha eliminado el contrato!",
      callback: () => {
        context.invalidate();
      },
    }),
  );
  const isVariableFrequency = contract.frequency === "VARIABLE";

  return (
    <div style={{ width: "50px" }}>
      <Menu>
        <MenuButton
          onClick={(e) => e.stopPropagation()}
          as={IconButton}
          size="sm"
          aria-label="options button"
          icon={<BsThreeDotsVertical />}
        />
        <MenuList>
          {isAdmin && <RowOptionsJsonView x={contract} />}
          {!isVariableFrequency && (
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                setConnectContractData(contract);
              }}
            >
              Conectar Solicitud/es existentes
            </MenuItem>
          )}
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              prefs?.selectedOrganization &&
                setNewRequestData(
                  transformContractToFormMoneyRequest({
                    contract,
                    organizationId: prefs.selectedOrganization,
                  }),
                );
            }}
          >
            Generar pago
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              setEditData(contract);
            }}
          >
            Editar
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              deleteById({
                id: contract.id,
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

export default ContractAccordionOptions;
