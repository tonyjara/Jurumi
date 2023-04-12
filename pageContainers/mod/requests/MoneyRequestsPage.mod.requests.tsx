import { useDisclosure } from "@chakra-ui/react";
import type {
  Account,
  CostCategory,
  ExpenseReport,
  ExpenseReturn,
  MoneyRequest,
  MoneyRequestApproval,
  Project,
  searchableImage,
  TaxPayerBankInfo,
  Transaction,
} from "@prisma/client";
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

export type MoneyRequestComplete = MoneyRequest & {
  account: Account;
  organization: {
    moneyAdministrators: {
      id: string;
      displayName: string;
    }[];
    moneyRequestApprovers: {
      id: string;
      displayName: string;
    }[];
  };
  project: Project | null;
  costCategory: CostCategory | null;
  taxPayer: {
    id: string;
    bankInfo: TaxPayerBankInfo | null;
    razonSocial: string;
    ruc: string;
  } | null;
  transactions: (Transaction & {
    searchableImage: {
      url: string;
      imageName: string;
    } | null;
  })[];
  expenseReports: (ExpenseReport & {
    taxPayer: {
      id: string;
      razonSocial: string;
    };
  })[];
  searchableImages: searchableImage[];
  expenseReturns: ExpenseReturn[];
  moneyRequestApprovals: MoneyRequestApproval[];
};

const ModMoneyRequestsPage = ({ query }: { query: MoneyRequestsPageProps }) => {
  const session = useSession();
  const user = session.data?.user;
  const [searchValue, setSearchValue] = useState({ value: "", filter: "id" });
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
      setSearchValue({ value: query.moneyRequestId, filter: "id" });
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
  const { data: count } = trpcClient.moneyRequest.count.useQuery();

  const { data: moneyRequests, isLoading } =
    trpcClient.moneyRequest.getManyComplete.useQuery(
      { pageIndex, pageSize, sorting: globalFilter ? sorting : null },
      { keepPreviousData: globalFilter ? true : false }
    );

  const { data: findByIdData, isFetching } =
    trpcClient.moneyRequest.findCompleteById.useQuery(searchValue, {
      enabled: searchValue.value.length > 0,
    });

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
        })}
        loading={isFetching || isLoading}
        options={tableOptions}
        data={handleDataSource() ?? []}
        count={count ?? 0}
        colorRedKey={["wasCancelled"]}
        rowOptions={rowOptionsFunction}
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
