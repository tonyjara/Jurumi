import { MenuItem } from "@chakra-ui/react";
import type { Transaction } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";
import type { TransactionComplete } from "./TransactionsPage.mod.transactions";

const RowOptionsModTransactions = ({
  x,
  onEditOpen,
  setEditTransaction,
}: {
  x: TransactionComplete;
  onEditOpen: () => void;
  setEditTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>;
}) => {
  const router = useRouter();

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
        }}
      >
        Ir a destino de concepto
      </MenuItem>
      <MenuItem
        isDisabled={!!x.cancellationId || x.isCancellation}
        onClick={() => {
          setEditTransaction(x);
          onEditOpen();
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
    </>
  );
};

export default RowOptionsModTransactions;
