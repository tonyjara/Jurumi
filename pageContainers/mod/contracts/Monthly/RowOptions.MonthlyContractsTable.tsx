import { RowOptionsJsonView } from "@/components/DynamicTables/RowOptions/RowOptionsJsonView";
import { MenuItem } from "@chakra-ui/react";
import type { MoneyRequest, Transaction } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";
import { GetManyContractsType } from "../Contract.types";
import { trpcClient } from "@/lib/utils/trpcClient";
import { transformContractToFormMoneyRequest } from "../ContractsUtils";
import { FormMoneyRequest } from "@/lib/validations/moneyRequest.validate";
import { MonthsInContract } from "./ContractMonthlyRequestsTable";

const RowOptionsMonthlyContractsTable = ({
  x,
  setMenuData,
  setNewRequestData,
  contract,
}: {
  x: MonthsInContract;
  setNewRequestData: React.Dispatch<
    React.SetStateAction<FormMoneyRequest | null>
  >;
  setMenuData: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
      rowData: any | null;
    }>
  >;
  contract: GetManyContractsType;
}) => {
  const { data: prefs } = trpcClient.preferences.getMyPreferences.useQuery();
  /* const closeMenu = () => { */
  /*   setMenuData({ x: 0, y: 0, rowData: null }); */
  /* }; */

  return (
    <>
      <MenuItem
        isDisabled={!!x.request}
        onClick={(e) => {
          e.stopPropagation();
          prefs?.selectedOrganization &&
            setNewRequestData(
              transformContractToFormMoneyRequest({
                contract,
                organizationId: prefs.selectedOrganization,
                monthData: x,
              }),
            );
        }}
      >
        Generar pago
      </MenuItem>
      <RowOptionsJsonView x={x} />
    </>
  );
};

export default RowOptionsMonthlyContractsTable;
