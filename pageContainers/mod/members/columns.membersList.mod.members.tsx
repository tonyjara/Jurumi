import { createColumnHelper } from "@tanstack/react-table";
import BooleanCell from "@/components/DynamicTables/DynamicCells/BooleanCell";
import DateCell from "@/components/DynamicTables/DynamicCells/DateCell";
import TextCell from "@/components/DynamicTables/DynamicCells/TextCell";
import type { CompleteMember } from "./MembersListPage.mod.members";

const columnHelper = createColumnHelper<CompleteMember>();

export const membersListPageColumns = ({
    pageIndex,
    pageSize,
}: {
    pageSize: number;
    pageIndex: number;
}) => [
        columnHelper.display({
            cell: (x) => x.row.index + 1 + pageIndex * pageSize,
            header: "N.",
        }),
        columnHelper.accessor("active", {
            header: "Activo",
            cell: (x) => <BooleanCell isActive={x.getValue()} />,
        }),
        columnHelper.accessor("createdAt", {
            cell: (x) => <DateCell date={x.getValue()} />,
            header: "Fecha de C.",
            sortingFn: "datetime",
        }),
        columnHelper.accessor("account.displayName", {
            header: "Nombre",
            cell: (x) => <TextCell text={x.getValue()} />,
        }),
        columnHelper.accessor("account.email", {
            header: "Correo",
            cell: (x) => <TextCell text={x.getValue()} />,
        }),
        columnHelper.accessor("account.role", {
            header: "Rol",
            cell: (x) => <TextCell text={x.getValue()} />,
        }),
        columnHelper.accessor("account.isVerified", {
            header: "Verificado",
            cell: (x) => <BooleanCell isActive={x.getValue()} />,
        }),
    ];
