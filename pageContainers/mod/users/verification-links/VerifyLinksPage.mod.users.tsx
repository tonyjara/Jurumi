import { useDisclosure } from "@chakra-ui/react";
import type { AccountVerificationLinks } from "@prisma/client";
import React from "react";
import type { TableOptions } from "@/components/DynamicTables/DynamicTable";
import DynamicTable from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import CreateAccountModal from "@/components/Modals/account.create.modal";
import { trpcClient } from "@/lib/utils/trpcClient";
import { verificationLinksColumns } from "./columns.mod.users.verification-links";
import { useSession } from "next-auth/react";
import RowOptionsVerificationLinks from "./rowOptions.mod.users.verification-links";

export interface VerificationLinksWithAccountName
    extends AccountVerificationLinks {
    account: {
        displayName: string;
    };
}

const VerificationLinksPage = () => {
    const user = useSession().data?.user;
    const dynamicTableProps = useDynamicTable();
    const { pageIndex, setGlobalFilter, globalFilter, pageSize, sorting } =
        dynamicTableProps;

    const { data, isFetching, isLoading } =
        trpcClient.magicLinks.getVerificationLinks.useQuery(
            { pageIndex, pageSize, sorting: globalFilter ? sorting : null },
            { keepPreviousData: globalFilter ? true : false }
        );
    const { data: count } = trpcClient.magicLinks.count.useQuery();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const tableOptions: TableOptions[] = [
        {
            onClick: onOpen,
            label: "Crear usuarios",
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

    const rowOptionsFunction = (x: VerificationLinksWithAccountName) => {
        return <RowOptionsVerificationLinks user={user} x={x} />;
    };
    return (
        <>
            <DynamicTable
                title={"Links de verificación"}
                subTitle="Los links tienen una máxima duración de 1 hora."
                columns={verificationLinksColumns({
                    pageIndex,
                    pageSize,
                    user,
                })}
                loading={isFetching || isLoading}
                options={tableOptions}
                data={data ?? []}
                count={count ?? 0}
                rowOptions={rowOptionsFunction}
                {...dynamicTableProps}
            />
            <CreateAccountModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};

export default VerificationLinksPage;
