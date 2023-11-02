import { Button } from "@chakra-ui/react";
import { Column } from "@tanstack/react-table";
import React from "react";
import { BsFilter } from "react-icons/bs";
import AccountDisplayNameColumnFilter from "./ColumnFilters/AccountDisplayName.columnFilter";
import FromToDateColumnFilter from "./ColumnFilters/FromToDateFilter.columnFilter";
import InputContainsColumnFilter from "./ColumnFilters/InputContains.columnFilter";
import MoneyAccountsColumnFilter from "./ColumnFilters/MoneyAccounts.columnFilter";
import MoneyRequestCostCategoriesColumnFilter from "./ColumnFilters/MoneyRequestCostCategories.columnFilter";
import MoneyRequestProjectsColumnFilter from "./ColumnFilters/MoneyRequestProjects.columnFilter";
import MoneyRequestStatusColumnFilter from "./ColumnFilters/MoneyRequestStatus.ColumnFilter";
import MoneyRequestTypeColumnFilter from "./ColumnFilters/MoneyRequestType.columnFilter";
import MoneyOrderNumberColumnFilter from "./ColumnFilters/MonyOrderNumber.columnfilter";
import TransactionTypeColumnFilter from "./ColumnFilters/TransactionType.columnFilter";

export interface ColumnFilterProps {
  keyName?: string;
  column: Column<any>;
  isNumber?: boolean;
  whereFilterList: any[];
  setWhereFilterList?: React.Dispatch<React.SetStateAction<any[]>>;
}

/** 
This component lists filters that are specific to a column. They change the way the "where" query is executed inside prisma to give server filtering.
If the column's id is here it will show a filter.
The keyname referes to the key of the object it will be filtered for.
*/
const ColumnFilter = (props: ColumnFilterProps) => {
  const { column, setWhereFilterList, whereFilterList } = props;

  return (
    <div>
      {column.id === "N." && (
        <Button
          leftIcon={<BsFilter />}
          size={"sm"}
          isDisabled={!whereFilterList.length}
          onClick={() => setWhereFilterList && setWhereFilterList([])}
        >
          Borrar Filtros
        </Button>
      )}
      {column.id === "status" && <MoneyRequestStatusColumnFilter {...props} />}{" "}
      {column.id === "account_displayName" && (
        <AccountDisplayNameColumnFilter {...props} />
      )}
      {column.id === "Proyecto" && (
        <MoneyRequestProjectsColumnFilter {...props} />
      )}{" "}
      {column.id === "Linea Presupuestaria" && (
        <MoneyRequestCostCategoriesColumnFilter {...props} />
      )}{" "}
      {column.id === "Cuenta" && <MoneyAccountsColumnFilter {...props} />}{" "}
      {column.id === "moneyRequestType" && (
        <MoneyRequestTypeColumnFilter {...props} />
      )}{" "}
      {column.id === "transactionType" && (
        <TransactionTypeColumnFilter {...props} />
      )}{" "}
      {column.id === "createdAt" && <FromToDateColumnFilter {...props} />}{" "}
      {column.id === "description" && (
        <InputContainsColumnFilter keyName="description" {...props} />
      )}{" "}
      {column.id === "Num" && (
        <InputContainsColumnFilter isNumber keyName="id" {...props} />
      )}{" "}
      {column.id === "id" && (
        <InputContainsColumnFilter keyName="id" {...props} />
      )}{" "}
      {column.id === "comments" && (
        <InputContainsColumnFilter keyName="comments" {...props} />
      )}{" "}
      {column.id === "moneyOrderNumber" && (
        <MoneyOrderNumberColumnFilter keyName="moneyOrderNumber" {...props} />
      )}{" "}
      {column.id === "facturaNumber" && (
        <InputContainsColumnFilter keyName="facturaNumber" {...props} />
      )}{" "}
      {column.id === "moneyRequestId" && (
        <InputContainsColumnFilter keyName="moneyRequestId" {...props} />
      )}{" "}
    </div>
  );
};

/* separator */
/* {column.id === "Concepto" && ( can't filter concepto in transaction becuase it varies depending on relation */
/*   <InputContainsColumnFilter keyName="description" {...props} /> */
/* )}{" "} */

export default ColumnFilter;
