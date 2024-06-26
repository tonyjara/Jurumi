import { createColumnHelper } from "@tanstack/react-table";
import DateCell from "@/components/DynamicTables/DynamicCells/DateCell";
import type { ProjectForTable } from "./ProjectsTable.mod.projects";
import TextCell from "@/components/DynamicTables/DynamicCells/TextCell";
import EnumTextCell from "@/components/DynamicTables/DynamicCells/EnumTextCell";
import { translateProjectType } from "@/lib/utils/TranslatedEnums";
import MoneyCell from "@/components/DynamicTables/DynamicCells/MoneyCell";
import { reduceCostCatAsignedAmount } from "@/lib/utils/CostCatUtilts";
import {
  projectDisbursedAmount,
  projectExecutedAmount,
} from "@/lib/utils/ProjectUtils";

const columnHelper = createColumnHelper<ProjectForTable>();

export const projectsColumn = () => [
  columnHelper.display({
    cell: (x) => x.row.index + 1,
    header: "N.",
  }),
  columnHelper.accessor("createdAt", {
    cell: (x) => <DateCell date={x.getValue()} />,
    header: "Fecha de Creación",
    sortingFn: "datetime",
  }),
  columnHelper.accessor("displayName", {
    cell: (x) => <TextCell text={x.getValue()} />,
    header: "Nombre",
  }),
  columnHelper.accessor("financerName", {
    cell: (x) => <TextCell text={x.getValue()} />,
    header: "Donante",
  }),
  columnHelper.accessor("projectType", {
    header: "Tipo",
    cell: (x) => (
      <EnumTextCell text={x.getValue()} enumFunc={translateProjectType} />
    ),
  }),
  columnHelper.accessor("description", {
    cell: (x) => (
      <TextCell text={x.getValue()} shortenString hover={x.getValue()} />
    ),
    header: "Concepto",
  }),
  columnHelper.display({
    header: "Asig. Gs.",
    cell: (x) => (
      <MoneyCell
        amount={reduceCostCatAsignedAmount({
          costCats: x.row.original.costCategories,
          currency: "PYG",
        })}
        currency={"PYG"}
      />
    ),
  }),
  columnHelper.display({
    header: "Asig. Usd.",
    cell: (x) => (
      <MoneyCell
        amount={reduceCostCatAsignedAmount({
          costCats: x.row.original.costCategories,
          currency: "USD",
        })}
        currency={"USD"}
      />
    ),
  }),
  columnHelper.display({
    header: "Ejec. Gs.",
    cell: (x) => (
      <MoneyCell
        amount={
          projectExecutedAmount({
            costCats: x.row.original.costCategories,
          }).gs
        }
        currency={"PYG"}
      />
    ),
  }),
  columnHelper.display({
    header: "Ejec. Usd.",
    cell: (x) => (
      <MoneyCell
        amount={
          projectExecutedAmount({
            costCats: x.row.original.costCategories,
          }).usd
        }
        currency={"USD"}
      />
    ),
  }),
  columnHelper.display({
    header: "Desemb. Usd.",
    cell: (x) => (
      <MoneyCell
        amount={projectDisbursedAmount({
          transactions: x.row.original.transactions,
        })}
        currency={"PYG"}
      />
    ),
  }),
  columnHelper.display({
    cell: (x) => (
      <TextCell text={x.row.original._count.allowedUsers.toLocaleString()} />
    ),
    header: "Miembros",
  }),
];
