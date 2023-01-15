import { createColumnHelper } from '@tanstack/react-table';
import DateCell from '@/components/DynamicTables/DynamicCells/DateCell';
import type { ProjectForTable } from './ProjectsTable.mod.projects';
import RowOptionsModProjects from './rowOptions.mod.projects';
import TextCell from '@/components/DynamicTables/DynamicCells/TextCell';
import EnumTextCell from '@/components/DynamicTables/DynamicCells/EnumTextCell';
import { translateProjectType } from '@/lib/utils/TranslatedEnums';
import MoneyCell from '@/components/DynamicTables/DynamicCells/MoneyCell';
import { reduceCostCatAsignedAmount } from '@/lib/utils/CostCatUtilts';
import { projectExecutedAmount } from '@/lib/utils/ProjectUtils';

const columnHelper = createColumnHelper<ProjectForTable>();

export const projectsColumn = ({
  onEditOpen,
  setEditProject,
  pageIndex,
  pageSize,
}: {
  onEditOpen: () => void;
  setEditProject: React.Dispatch<React.SetStateAction<ProjectForTable | null>>;
  pageSize: number;
  pageIndex: number;
}) => [
  columnHelper.display({
    cell: (x) => x.row.index + 1 + pageIndex * pageSize,
    header: 'N.',
  }),
  columnHelper.accessor('createdAt', {
    cell: (x) => <DateCell date={x.getValue()} />,
    header: 'Fecha de C.',
    sortingFn: 'datetime',
  }),
  columnHelper.accessor('displayName', {
    cell: (x) => <TextCell text={x.getValue()} />,
    header: 'Nombre',
  }),
  columnHelper.accessor('projectType', {
    header: 'Tipo',
    cell: (x) => (
      <EnumTextCell text={x.getValue()} enumFunc={translateProjectType} />
    ),
  }),
  columnHelper.accessor('description', {
    cell: (x) => (
      <TextCell text={x.getValue()} shortenString hover={x.getValue()} />
    ),
    header: 'Concepto',
  }),
  columnHelper.display({
    header: 'Asig. Gs.',
    cell: (x) => (
      <MoneyCell
        amount={reduceCostCatAsignedAmount({
          costCats: x.row.original.costCategories,
          currency: 'PYG',
        })}
        currency={'PYG'}
      />
    ),
  }),
  columnHelper.display({
    header: 'Asig. Usd.',
    cell: (x) => (
      <MoneyCell
        amount={reduceCostCatAsignedAmount({
          costCats: x.row.original.costCategories,
          currency: 'USD',
        })}
        currency={'USD'}
      />
    ),
  }),
  columnHelper.display({
    header: 'Ejec. Gs.',
    cell: (x) => (
      <MoneyCell
        amount={
          projectExecutedAmount({
            costCats: x.row.original.costCategories,
          }).gs
        }
        currency={'PYG'}
      />
    ),
  }),
  columnHelper.display({
    header: 'Ejec. Usd.',
    cell: (x) => (
      <MoneyCell
        amount={
          projectExecutedAmount({
            costCats: x.row.original.costCategories,
          }).usd
        }
        currency={'USD'}
      />
    ),
  }),
  columnHelper.display({
    cell: (x) => (
      <TextCell text={x.row.original._count.allowedUsers.toLocaleString()} />
    ),
    header: 'Miembros',
  }),
  columnHelper.display({
    header: 'Opciones',
    cell: (x) => (
      <RowOptionsModProjects
        x={x.row.original}
        onEditOpen={onEditOpen}
        setEditProject={setEditProject}
      />
    ),
  }),
];
