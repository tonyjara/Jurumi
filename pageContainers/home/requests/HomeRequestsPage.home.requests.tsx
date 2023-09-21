import { useDisclosure } from "@chakra-ui/react";
import type { MoneyRequest } from "@prisma/client";
import React, { useState } from "react";
import type {
  RowOptionsType,
  TableOptions,
} from "@/components/DynamicTables/DynamicTable";
import DynamicTable from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import CreateExpenseReportModal from "@/components/Modals/ExpenseReport.create.modal";
import EditMoneyRequestModal from "@/components/Modals/MoneyReq.edit.modal";
import CreateMoneyRequestModal from "@/components/Modals/MoneyRequest.create.modal";
import { trpcClient } from "@/lib/utils/trpcClient";
import { homeRequestsColumns } from "./columns.home.requests";
import CreateExpenseReturnModal from "@/components/Modals/ExpenseReturn.create.modal";
import RowOptionsHomeRequests from "./rowOptions.home.requests";
import HomeRequestsExtraFilters from "./HomeRequestsExtraFilters.home.requests";
import { CompleteMoneyReqHome } from "./home.requests.types";

const MoneyRequestsPage = () => {
  const [whereFilterList, setWhereFilterList] = useState<string[]>([]);
  const [extraFilters, setExtraFilters] = useState<string[]>([]);
  const [editMoneyRequest, setEditMoneyRequest] = useState<MoneyRequest | null>(
    null,
  );
  const [reqForReport, setReqForReport] = useState<CompleteMoneyReqHome | null>(
    null,
  );
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, setGlobalFilter, globalFilter, pageSize, sorting } =
    dynamicTableProps;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isExpRepOpen,
    onOpen: onExpRepOpen,
    onClose: onExpRepClose,
  } = useDisclosure();
  const {
    isOpen: isExpenseReturnOpen,
    onOpen: onExpenseReturnOpen,
    onClose: onExpenseReturnClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const { data: prefs } = trpcClient.preferences.getMyPreferences.useQuery();

  const { data: moneyRequests, isFetching } =
    trpcClient.moneyRequest.getMyOwnComplete.useQuery(
      {
        pageIndex,
        pageSize,
        sorting: globalFilter ? sorting : null,
        whereFilterList,
        extraFilters,
      },
      { keepPreviousData: globalFilter ? true : false },
    );

  const { data: count } = trpcClient.moneyRequest.countMyOwn.useQuery({
    extraFilters,
    whereFilterList,
  });

  const tableOptions: TableOptions[] = [
    {
      onClick: onOpen,
      label: "Crear solicitud",
    },
    {
      onClick: () => setGlobalFilter(true),
      label: `${globalFilter ? "✅" : "❌"} Filtro global`,
    },
    {
      onClick: () => setGlobalFilter(false),
      label: `${!globalFilter ? "✅" : "❌"} Filtro local`,
    },
  ];

  const rowOptionsFunction: RowOptionsType = ({ x, setMenuData }) => {
    return (
      <RowOptionsHomeRequests
        x={x}
        setMenuData={setMenuData}
        onEditOpen={onEditOpen}
        setEditMoneyRequest={setEditMoneyRequest}
        setReqForReport={setReqForReport}
        onExpRepOpen={onExpRepOpen}
        onExpReturnOpen={onExpenseReturnOpen}
      />
    );
  };

  return (
    <>
      <DynamicTable
        title={"Mis Solicitudes"}
        enableColumnFilters={true}
        whereFilterList={whereFilterList}
        setWhereFilterList={setWhereFilterList}
        loading={isFetching}
        options={tableOptions}
        rowOptions={rowOptionsFunction}
        columns={homeRequestsColumns({
          pageIndex,
          pageSize,
        })}
        headerComp={
          <HomeRequestsExtraFilters
            extraFilters={extraFilters}
            setExtraFilters={setExtraFilters}
          />
        }
        data={moneyRequests ?? []}
        count={count ?? 0}
        colorRedKey={["wasCancelled"]}
        {...dynamicTableProps}
      />

      {prefs?.selectedOrganization && (
        <CreateMoneyRequestModal
          orgId={prefs.selectedOrganization}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
      {reqForReport && (
        <CreateExpenseReportModal
          moneyRequest={reqForReport}
          isOpen={isExpRepOpen}
          onClose={onExpRepClose}
        />
      )}
      {reqForReport && (
        <CreateExpenseReturnModal
          moneyRequest={reqForReport}
          isOpen={isExpenseReturnOpen}
          onClose={onExpenseReturnClose}
        />
      )}
      {editMoneyRequest && (
        <EditMoneyRequestModal
          moneyRequest={editMoneyRequest}
          isOpen={isEditOpen}
          onClose={onEditClose}
        />
      )}
    </>
  );
};

export default MoneyRequestsPage;
