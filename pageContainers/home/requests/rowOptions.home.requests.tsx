import { MenuItem } from "@chakra-ui/react";
import type { MoneyRequest } from "@prisma/client";
import { Prisma } from "@prisma/client";
import React from "react";
import { handleUseMutationAlerts } from "@/components/Toasts & Alerts/MyToast";
import { trpcClient } from "@/lib/utils/trpcClient";
import type { CompleteMoneyReqHome } from "./HomeRequestsPage.home.requests";
import { RowOptionDeleteDialog } from "@/components/Toasts & Alerts/RowOption.delete.dialog";
import {
  reduceExpenseReturnsToSetCurrency,
  reduceExpenseReportsToSetCurrency,
} from "@/lib/utils/TransactionUtils";
import MoneyRequestPrintComponents from "@/components/Print/MoneyRequest.print.components";
import UsePrintComponent from "@/components/Print/UsePrintComponent";
import { RowOptionCancelDialog } from "@/components/Toasts & Alerts/RowOptions.cancel.dialog";

const RowOptionsHomeRequests = ({
  x,
  setEditMoneyRequest,
  onEditOpen,
  onExpRepOpen,
  setReqForReport,
  onExpReturnOpen,
  setMenuData,
}: {
  x: CompleteMoneyReqHome;
  setEditMoneyRequest: React.Dispatch<
    React.SetStateAction<MoneyRequest | null>
  >;
  setReqForReport: React.Dispatch<
    React.SetStateAction<CompleteMoneyReqHome | null>
  >;
  onEditOpen: () => void;
  onExpRepOpen: () => void;
  onExpReturnOpen: () => void;
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
    setMenuData((prev) => ({ ...prev, rowData: null }));
  };

  const { mutate: deleteById } = trpcClient.moneyRequest.deleteById.useMutation(
    handleUseMutationAlerts({
      successText: "Se ha eliminado la solicitud!",
      callback: () => {
        context.moneyRequest.invalidate();
        closeMenu();
      },
    })
  );

  const { mutate: cancelById } =
    trpcClient.moneyRequest.cancelMyOwnById.useMutation(
      handleUseMutationAlerts({
        successText: "Se ha anulado su solicitud!",
        callback: () => {
          context.invalidate();
          closeMenu();
        },
      })
    );

  const isAccepted = x.status === "ACCEPTED";

  const isCancelled = x.wasCancelled;

  const isGreaterOrEqualToReportedAndReturnedTotal =
    reduceExpenseReportsToSetCurrency({
      expenseReports: x.expenseReports,
      currency: x.currency,
    })
      .add(
        reduceExpenseReturnsToSetCurrency({
          expenseReturns: x.expenseReturns,
          currency: x.currency,
        })
      )
      // RONDING BY 1 TO AVOID FLOATING POINT ERRORS
      .greaterThanOrEqualTo(x.amountRequested.sub(new Prisma.Decimal(1)));

  const {
    isPrinting,
    handlePrintExpenseRepsAndRets,
    handlePrintFundRequest,
    printFundReqRef,
    printExpRepsAndRetsRef,
  } = UsePrintComponent({ x, callback: closeMenu });

  return (
    <div>
      <>
        {(x.moneyRequestType === "FUND_REQUEST" ||
          x.moneyRequestType === "MONEY_ORDER") && (
          <MenuItem
            isDisabled={!isAccepted || x.wasCancelled}
            onClick={() => {
              setReqForReport(x);
              onExpRepOpen();
              closeMenu();
            }}
          >
            Crear rendición
          </MenuItem>
        )}
        <MenuItem
          isDisabled={
            !isAccepted ||
            x.wasCancelled ||
            x.moneyRequestType === "REIMBURSMENT_ORDER" ||
            x.moneyRequestType === "MONEY_ORDER"
          }
          onClick={() => {
            setReqForReport(x);
            onExpReturnOpen();
            closeMenu();
          }}
        >
          Generar devolución
        </MenuItem>
        <MenuItem onClick={handlePrintFundRequest}>Imprimir solicitud</MenuItem>

        {(x.moneyRequestType === "FUND_REQUEST" ||
          x.moneyRequestType === "MONEY_ORDER") && (
          <MenuItem
            isDisabled={!isGreaterOrEqualToReportedAndReturnedTotal}
            onClick={handlePrintExpenseRepsAndRets}
          >
            Imprimir rendición
          </MenuItem>
        )}

        <MenuItem
          isDisabled={isAccepted || isCancelled}
          onClick={() => {
            setEditMoneyRequest(x);
            onEditOpen();
            closeMenu();
          }}
        >
          Editar
        </MenuItem>

        <RowOptionCancelDialog
          isDisabled={x.wasCancelled}
          targetName="solicitud"
          onConfirm={() => cancelById({ id: x.id })}
        />
        <RowOptionDeleteDialog
          targetName="solicitud"
          onConfirm={() => deleteById({ id: x.id })}
        />
      </>
      <MoneyRequestPrintComponents
        x={x}
        isPrinting={isPrinting}
        printExpRepsAndRetsRef={printExpRepsAndRetsRef}
        printFundReqRef={printFundReqRef}
      />
    </div>
  );
};

export default RowOptionsHomeRequests;
