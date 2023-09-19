import { useDisclosure } from "@chakra-ui/react";
import type { MoneyRequest, Prisma } from "@prisma/client";
import React, { useEffect, useState } from "react";
import type {
  RowOptionsType,
  TableOptions,
} from "@/components/DynamicTables/DynamicTable";
import DynamicTable from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import TableSearchbar from "@/components/DynamicTables/Utils/TableSearchbar";
import EditMoneyRequestModal from "@/components/Modals/MoneyReq.edit.modal";
import CreateMoneyRequestModal from "@/components/Modals/MoneyRequest.create.modal";
import { trpcClient } from "@/lib/utils/trpcClient";
import type { MoneyRequestsPageProps } from "pages/mod/requests";
import { moneyRequestsColumns } from "./columns.mod.requests";
import CreateExpenseReportModal from "@/components/Modals/ExpenseReport.create.modal";
import CreateExpenseReturnModal from "@/components/Modals/ExpenseReturn.create.modal";
import RowOptionsModRequests from "./rowOptions.mod.requests";
import { ApprovalUtils } from "@/lib/utils/ApprovalUtilts";
import { MoneyRequestComplete } from "./mod.requests.types";
import useDebounce from "@/lib/hooks/useDebounce";
import MoneyRequestExtraFilters from "./MoneyRequestExtraFilters.mod.requests";
import { rawValuesModMoneyRequests } from "./rawValues.mod.MoneyRequests";

const ModMoneyRequestsPage = ({ query }: { query: MoneyRequestsPageProps }) => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [filterValue, setFilterValue] = useState("id");
  const [extraFilters, setExtraFilters] = useState<string[]>([]);
  const [whereFilterList, setWhereFilterList] = useState<
    Prisma.MoneyRequestScalarWhereInput[]
  >([]);
  const [selectedRows, setSelectedRows] = useState<MoneyRequestComplete[]>([]);
  const [editMoneyRequest, setEditMoneyRequest] = useState<MoneyRequest | null>(
    null,
  );
  const [reqForReport, setReqForReport] = useState<MoneyRequestComplete | null>(
    null,
  );
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, setGlobalFilter, globalFilter, pageSize, sorting } =
    dynamicTableProps;

  useEffect(() => {
    if (query.moneyRequestId) {
      setSearchValue(query.moneyRequestId);
      setFilterValue("id");
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
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

  useEffect(() => {
    if (!isEditOpen && editMoneyRequest) {
      setEditMoneyRequest(null);
    }
    return () => {};
  }, [editMoneyRequest, isEditOpen]);

  const { data: prefs } = trpcClient.preferences.getMyPreferences.useQuery();
  const { data: count } = trpcClient.moneyRequest.count.useQuery({
    extraFilters,
    whereFilterList,
  });

  const { data: moneyRequests, isLoading } =
    trpcClient.moneyRequest.getManyComplete.useQuery(
      {
        extraFilters,
        pageIndex,
        pageSize,
        sorting: globalFilter ? sorting : null,
        whereFilterList,
      },
      { keepPreviousData: globalFilter ? true : false },
    );

  const { data: findByIdData, isFetching } =
    trpcClient.moneyRequest.findCompleteById.useQuery(
      {
        value: debouncedSearchValue,
        filter: filterValue,
        extraFilters,
        whereFilterList,
      },
      {
        enabled: debouncedSearchValue.length > 0,
      },
    );

  const handleDataSource = () => {
    if (findByIdData) return findByIdData;
    return moneyRequests ?? [];
  };

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
    const { needsApproval, hasBeenApproved } = ApprovalUtils(x as any);
    return (
      <RowOptionsModRequests
        hasBeenApproved={hasBeenApproved()}
        needsApproval={needsApproval()}
        onEditOpen={onEditOpen}
        onExpRepOpen={onExpRepOpen}
        selectedRows={selectedRows}
        setEditMoneyRequest={setEditMoneyRequest}
        setReqForReport={setReqForReport}
        x={x}
        onExpReturnOpen={onExpenseReturnOpen}
        setMenuData={setMenuData}
      />
    );
  };

  return (
    <>
      <DynamicTable
        title={"Solicitudes"}
        enableColumnFilters={true}
        whereFilterList={whereFilterList}
        setWhereFilterList={setWhereFilterList}
        rawValuesDictionary={rawValuesModMoneyRequests}
        searchBar={
          <TableSearchbar
            type="text"
            placeholder="Buscar por"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            filterOptions={[
              { value: "id", label: "Id" },
              {
                value: "amountRequested",
                label: "Igual o mayor al Monto solicitado",
              },
            ]}
          />
        }
        columns={moneyRequestsColumns({
          pageIndex,
          pageSize,
          selectedRows,
          setSelectedRows,
          rowsLength:
            (pageSize < (moneyRequests?.length ?? 0)
              ? pageSize
              : moneyRequests?.length) ?? 0,
        })}
        loading={isFetching || isLoading}
        options={tableOptions}
        data={handleDataSource() ?? []}
        count={count ?? 0}
        colorRedKey={["wasCancelled"]}
        rowOptions={rowOptionsFunction}
        headerComp={
          <MoneyRequestExtraFilters
            extraFilters={extraFilters}
            setExtraFilters={setExtraFilters}
          />
        }
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

export default ModMoneyRequestsPage;
