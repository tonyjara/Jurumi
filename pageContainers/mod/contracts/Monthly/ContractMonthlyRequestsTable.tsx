import DynamicTable, {
  RowOptionsType,
} from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import { Flex, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import { MoneyRequest } from "@prisma/client";
import { contractMonthlyColumns } from "../../taxpayers/columns.mod.contractMonthly";
import { GetManyContractsType } from "../Contract.types";
import { contractMonths } from "../ContractsUtils/MonthlyContractUtils";
import RowOptionsMonthlyContractsTable from "./RowOptions.MonthlyContractsTable";
import { trpcClient } from "@/lib/utils/trpcClient";
import { FormMoneyRequest } from "@/lib/validations/moneyRequest.validate";
import ConnectRequestToContractModal from "@/components/Modals/ConnectRequestToContract.modal";
import CreateMoneyRequestModal from "@/components/Modals/MoneyRequest.create.modal";

export interface MonthsInContract {
  contractStartInMonthDate: Date;
  formatedMonth: string;
  request: MoneyRequest | null;
}

const ContractMonthlyRequestsTable = ({
  contract,
}: {
  contract: GetManyContractsType;
}) => {
  const { onClose: onCreateRequestClose } = useDisclosure();
  const [connectContractData, setConnectContractData] =
    useState<GetManyContractsType | null>(null);
  const [newRequestData, setNewRequestData] = useState<FormMoneyRequest | null>(
    null,
  );
  const { data: prefs } = trpcClient.preferences.getMyPreferences.useQuery();
  const pagination = useDynamicTable();
  const data = contractMonths(contract).reverse();

  const rowOptionsFunction: RowOptionsType = ({ x, setMenuData }) => {
    return (
      <RowOptionsMonthlyContractsTable
        setMenuData={setMenuData}
        contract={contract}
        setNewRequestData={setNewRequestData}
        x={x}
      />
    );
  };
  return (
    <Flex>
      <DynamicTable
        rowOptions={rowOptionsFunction}
        columns={contractMonthlyColumns()}
        data={data}
        {...pagination}
      />
      {connectContractData && (
        <ConnectRequestToContractModal
          contract={connectContractData}
          onClose={() => setConnectContractData(null)}
        />
      )}
      {prefs?.selectedOrganization && newRequestData && (
        <CreateMoneyRequestModal
          orgId={prefs.selectedOrganization}
          isOpen={!!newRequestData}
          onClose={() => {
            setNewRequestData(null);
            onCreateRequestClose();
          }}
          incomingMoneyRequest={newRequestData}
        />
      )}
    </Flex>
  );
};

export default ContractMonthlyRequestsTable;
