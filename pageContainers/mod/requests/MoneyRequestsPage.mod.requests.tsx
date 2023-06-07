import {
  Text,
  HStack,
  Radio,
  RadioGroup,
  useDisclosure,
  Checkbox,
  Flex,
} from "@chakra-ui/react";
import type { MoneyRequest } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import type { TableOptions } from "@/components/DynamicTables/DynamicTable";
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

const ModMoneyRequestsPage = ({ query }: { query: MoneyRequestsPageProps }) => {
  const session = useSession();
  const user = session.data?.user;
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [filterValue, setFilterValue] = useState("id");
  const [pendingFilter, setPendingFilter] = useState<
    "reportPending" | "executionPending" | null
  >(null);
  const [selectedRows, setSelectedRows] = useState<MoneyRequestComplete[]>([]);
  const [editMoneyRequest, setEditMoneyRequest] = useState<MoneyRequest | null>(
    null
  );
  const [reqForReport, setReqForReport] = useState<MoneyRequestComplete | null>(
    null
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
    pendingFilter,
  });

  const { data: moneyRequests, isLoading } =
    trpcClient.moneyRequest.getManyComplete.useQuery(
      {
        pendingFilter,
        pageIndex,
        pageSize,
        sorting: globalFilter ? sorting : null,
      },
      { keepPreviousData: globalFilter ? true : false }
    );

  const { data: findByIdData, isFetching } =
    trpcClient.moneyRequest.findCompleteById.useQuery(
      { value: debouncedSearchValue, filter: filterValue, pendingFilter },
      {
        enabled: searchValue.length > 0,
      }
    );

  const handleDataSource = () => {
    if (!moneyRequests) return [];
    if (findByIdData) return findByIdData;
    if (moneyRequests) return moneyRequests;
    return [];
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

  const rowOptionsFunction = (x: MoneyRequestComplete) => {
    const { needsApproval, hasBeenApproved } = ApprovalUtils(x as any, user);
    return (
      <RowOptionsModRequests
        needsApproval={needsApproval()}
        selectedRows={selectedRows}
        x={x}
        onEditOpen={onEditOpen}
        setEditMoneyRequest={setEditMoneyRequest}
        hasBeenApproved={hasBeenApproved()}
        setReqForReport={setReqForReport}
        onExpRepOpen={onExpRepOpen}
        onExpReturnOpen={onExpenseReturnOpen}
      />
    );
  };

  const radioOptions = [
    {
      value: "beingReported",
      label: "Rendición pendiente",
    },
    {
      value: "pendingExecution",
      label: "Ejecución pendiente",
    },
  ];

  return (
    <>
      <DynamicTable
        title={"Solicitudes"}
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
          user,
          pageIndex,
          pageSize,
          selectedRows,
          setSelectedRows,
        })}
        loading={isFetching || isLoading}
        options={tableOptions}
        data={handleDataSource() ?? []}
        count={count ?? 0}
        colorRedKey={["wasCancelled"]}
        rowOptions={rowOptionsFunction}
        headerComp={
          <Flex
            pt="20px"
            px={{
              base: "0px",
              sm: "5px",
              md: "5px",
            }}
            ml={{ base: "-5px", sm: "0px", md: "0px" }}
            gap="20px"
            display="flex"
            alignItems="center"
            flexDirection={{ base: "column", md: "row" }}
          >
            {radioOptions.map((x) => (
              <Checkbox
                name={x.value}
                size="lg"
                onChange={() => {
                  if (pendingFilter === x.value) {
                    return setPendingFilter(null);
                  }
                  setPendingFilter(x.value as any);
                }}
                isChecked={pendingFilter === x.value}
                value={x.value}
                key={x.value}
                color="gray.500"
                textTransform="uppercase"
                fontWeight="bold"
                alignItems="center"
              >
                <Text fontSize="sm" overflow="hidden">
                  {x.label}
                </Text>
              </Checkbox>
            ))}
          </Flex>
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
