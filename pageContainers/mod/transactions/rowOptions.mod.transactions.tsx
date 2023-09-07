import { RowOptionsJsonView } from "@/components/DynamicTables/RowOptions/RowOptionsJsonView";
import { MenuItem } from "@chakra-ui/react";
import type { Transaction } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";
import { TransactionComplete } from "./transactions.types";

const RowOptionsModTransactions = ({
  x,
  onEditOpen,
  setEditTransaction,
  setMenuData,
}: {
  x: TransactionComplete;
  onEditOpen: () => void;
  setEditTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>;
  setMenuData: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
      rowData: any | null;
    }>
  >;
}) => {
  const router = useRouter();
  const closeMenu = () => {
    setMenuData({ x: 0, y: 0, rowData: null });
  };

  const handleQueryParams = () => {
    if (x.moneyRequestId) return { moneyRequestId: x.moneyRequestId };
    if (x.imbursementId) return { imbursementId: x.imbursementId };
    if (x.expenseReturnId) return { expenseReturnId: x.expenseReturnId };

    return null;
  };

  return (
    <>
      {!!x.cancellationId ||
        (x.isCancellation && (
          <MenuItem>Esta transacción fue anulada.</MenuItem>
        ))}
      <MenuItem
        isDisabled={!!x.cancellationId || x.isCancellation}
        onClick={() => {
          router.push({
            pathname: "/mod/requests",
            query: handleQueryParams(),
          });
          closeMenu();
        }}
      >
        Ir a destino de concepto
      </MenuItem>
      <MenuItem
        isDisabled={!!x.cancellationId || x.isCancellation}
        onClick={() => {
          setEditTransaction(x);
          onEditOpen();
          closeMenu();
        }}
      >
        Editar
      </MenuItem>
      {/* //DO NOT DELETE TRANSACTIONS DIRECTLY */}
      {/**/}
      {/* <MenuItem */}
      {/*     isDisabled={!!x.cancellationId || x.isCancellation} */}
      {/*     onClick={() => */}
      {/*         deleteById({ */}
      {/*             id: x.id, */}
      {/*             moneyAccountId: x.moneyAccountId, */}
      {/*             costCategoryId: x.costCategoryId, */}
      {/*         }) */}
      {/*     } */}
      {/* > */}
      {/*     Eliminar */}
      {/* </MenuItem> */}

      <RowOptionsJsonView x={x} />
    </>
  );
};

export default RowOptionsModTransactions;
