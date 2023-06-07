import { MenuItem } from "@chakra-ui/react";
import type { MoneyRequest } from "@prisma/client";
import router from "next/router";
import React from "react";
import { handleUseMutationAlerts } from "@/components/Toasts & Alerts/MyToast";
import { trpcClient } from "@/lib/utils/trpcClient";
import { RowOptionDeleteDialog } from "@/components/Toasts & Alerts/RowOption.delete.dialog";
import { RowOptionCancelDialog } from "@/components/Toasts & Alerts/RowOptions.cancel.dialog";
import {
  reduceExpenseReports,
  reduceExpenseReturns,
} from "@/lib/utils/TransactionUtils";
import cloneDeep from "lodash.clonedeep";
import UsePrintComponent from "@/components/Print/UsePrintComponent";
import MoneyRequestPrintComponents from "@/components/Print/MoneyRequest.print.components";
import { useSession } from "next-auth/react";
import ExportToExcelMenuItem from "@/components/Xlsx/ExportToExcelMenuItem";
import { MoneyRequestComplete } from "./mod.requests.types";

const RowOptionsModRequests = ({
  x,
  setEditMoneyRequest,
  onEditOpen,
  needsApproval,
  hasBeenApproved,
  setReqForReport,
  onExpRepOpen,
  onExpReturnOpen,
  selectedRows,
}: {
  x: MoneyRequestComplete;
  setEditMoneyRequest: React.Dispatch<
    React.SetStateAction<MoneyRequest | null>
  >;
  onEditOpen: () => void;
  needsApproval: boolean;
  hasBeenApproved: boolean;
  setReqForReport: React.Dispatch<
    React.SetStateAction<MoneyRequestComplete | null>
  >;
  onExpRepOpen: () => void;
  onExpReturnOpen: () => void;
  selectedRows: MoneyRequestComplete[];
}) => {
  const context = trpcClient.useContext();
  const isAdmin = useSession().data?.user.role === "ADMIN";
  const { mutate: deleteById } = trpcClient.moneyRequest.deleteById.useMutation(
    handleUseMutationAlerts({
      successText: "Se ha eliminado la solicitud!",
      callback: () => {
        context.invalidate();
      },
    })
  );
  const { mutate: cancelById } = trpcClient.moneyRequest.cancelById.useMutation(
    handleUseMutationAlerts({
      successText: "Se ha anulado la solicitud!",
      callback: () => {
        context.invalidate();
      },
    })
  );
  const isAccepted = x.status === "ACCEPTED";
  const isCancelled = x.wasCancelled;
  const isGreaterOrEqualToExecutionTotal = reduceExpenseReports(
    x.expenseReports
  )
    .add(reduceExpenseReturns(x.expenseReturns))
    .greaterThanOrEqualTo(x.amountRequested);

  const {
    isPrinting,
    handlePrintExpenseRepsAndRets,
    handlePrintFundRequest,
    printFundReqRef,
    printExpRepsAndRetsRef,
  } = UsePrintComponent({ x });

  return (
    <div>
      <MenuItem
        isDisabled={
          (needsApproval && !hasBeenApproved) || isAccepted || isCancelled
        }
        onClick={() => {
          router.push({
            pathname: "/mod/transactions/create",
            query: { moneyRequestId: x.id },
          });
        }}
      >
        Aceptar y ejecutar{" "}
        {needsApproval && !hasBeenApproved && "( Necesita aprobación )"}
      </MenuItem>
      <MenuItem
        isDisabled={isAccepted || isCancelled}
        onClick={() => {
          const rejected = cloneDeep(x);
          rejected.status = "REJECTED";
          setEditMoneyRequest(rejected);
          onEditOpen();
        }}
      >
        Rechazar
      </MenuItem>
      <MenuItem
        isDisabled={(!isAdmin && isAccepted) || isCancelled}
        onClick={() => {
          setEditMoneyRequest(x);
          onEditOpen();
        }}
      >
        Editar
      </MenuItem>

      {x.moneyRequestType === "FUND_REQUEST" && (
        <MenuItem
          isDisabled={
            !isAccepted || x.wasCancelled || isGreaterOrEqualToExecutionTotal
          }
          onClick={() => {
            setReqForReport(x);
            onExpRepOpen();
          }}
        >
          Crear rendición
        </MenuItem>
      )}
      <MenuItem
        isDisabled={
          !isAccepted ||
          x.wasCancelled ||
          isGreaterOrEqualToExecutionTotal ||
          x.moneyRequestType === "REIMBURSMENT_ORDER"
        }
        onClick={() => {
          setReqForReport(x);
          onExpReturnOpen();
        }}
      >
        Generar devolución
      </MenuItem>
      <MenuItem
        isDisabled={!x.transactions.length}
        onClick={() => {
          router.push({
            pathname: "/mod/transactions",
            query: { transactionIds: x.transactions.map((x) => x.id) },
          });
        }}
      >
        Ver transacciones
      </MenuItem>

      <MenuItem
        isDisabled={!x.expenseReports.length}
        onClick={() => {
          router.push({
            pathname: "/mod/expense-reports",
            query: { expenseReportsIds: x.expenseReports.map((x) => x.id) },
          });
        }}
      >
        Ver Rendiciones
      </MenuItem>

      <ExportToExcelMenuItem data={selectedRows} />
      <MenuItem onClick={handlePrintFundRequest}>Imprimir solicitud</MenuItem>

      {x.moneyRequestType === "FUND_REQUEST" && (
        <MenuItem
          isDisabled={!isGreaterOrEqualToExecutionTotal}
          onClick={handlePrintExpenseRepsAndRets}
        >
          Imprimir rendición/es
        </MenuItem>
      )}
      <RowOptionCancelDialog
        isDisabled={x.wasCancelled}
        targetName="solicitud"
        onConfirm={() => cancelById({ id: x.id })}
      />
      <RowOptionDeleteDialog
        targetName="solicitud"
        onConfirm={() => deleteById({ id: x.id })}
      />
      <MoneyRequestPrintComponents
        x={x}
        isPrinting={isPrinting}
        printExpRepsAndRetsRef={printExpRepsAndRetsRef}
        printFundReqRef={printFundReqRef}
      />
    </div>
  );
};

export default RowOptionsModRequests;
