import ImbursementCreateModal from "@/components/Modals/imbursement.create.modal";
import { useDisclosure } from "@chakra-ui/react";
import type { Imbursement, Prisma } from "@prisma/client";
import React, { useEffect, useState } from "react";
import type {
  RowOptionsType,
  TableOptions,
} from "@/components/DynamicTables/DynamicTable";
import DynamicTable from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import { trpcClient } from "@/lib/utils/trpcClient";
import { imbursementsColumns } from "./colums.mod.imbursements";
import ImbursementEditModal from "@/components/Modals/imbursement.edit.modal";
import type { FormImbursement } from "@/lib/validations/imbursement.validate";
import RowOptionsImbursements from "./rowOptions.mod.imbursements";

export type imbursementComplete = Imbursement & {
  transactions: {
    id: number;
  }[];
  account: {
    id: string;
    displayName: string;
  };
  project: {
    id: string;
    displayName: string;
  } | null;
  taxPayer: {
    id: string;
    ruc: string;
    razonSocial: string;
  };
  moneyAccount: {
    displayName: string;
  } | null;
  imbursementProof: {
    url: string;
    imageName: string;
  } | null;
  invoiceFromOrg: {
    url: string;
    imageName: string;
  } | null;
};

const ImbursementsPage = ({ taxPayerId }: { taxPayerId?: string }) => {
  const [editImbursement, setEditImbursement] =
    useState<FormImbursement | null>(null);
  const dynamicTableProps = useDynamicTable();
  const [whereFilterList, setWhereFilterList] = useState<
    Prisma.ImbursementScalarWhereInput[]
  >([]);
  const { pageIndex, setGlobalFilter, globalFilter, pageSize, sorting } =
    dynamicTableProps;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  //Used when selecting a taxPayer in movimientosPage
  useEffect(() => {
    if (taxPayerId === undefined) return;
    setWhereFilterList((prev) => prev.filter((x) => !x.taxPayerId));
    if (taxPayerId === "") return;
    setWhereFilterList((prev) => [...prev, { taxPayerId }]);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxPayerId]);

  useEffect(() => {
    if (!isEditOpen && editImbursement) {
      setEditImbursement(null);
    }
    return () => {};
  }, [editImbursement, isEditOpen]);

  const { data: imbursements, isFetching } =
    trpcClient.imbursement.getManyComplete.useQuery(
      {
        pageIndex,
        pageSize,
        sorting: globalFilter ? sorting : null,
        whereFilterList,
      },
      { keepPreviousData: globalFilter ? true : false },
    );
  const { data: count } = trpcClient.imbursement.count.useQuery({
    whereFilterList,
  });

  const tableOptions: TableOptions[] = [
    {
      onClick: onOpen,
      label: "Crear desembolso",
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
  const rowOptionsFunction: RowOptionsType = ({ x, setMenuData }) => {
    return (
      <RowOptionsImbursements
        x={x}
        onEditOpen={onEditOpen}
        setEditImbursement={setEditImbursement}
        setMenuData={setMenuData}
      />
    );
  };

  return (
    <>
      <DynamicTable
        title={"Desembolsos"}
        enableColumnFilters={true}
        whereFilterList={whereFilterList}
        setWhereFilterList={setWhereFilterList}
        loading={isFetching}
        options={tableOptions}
        rowOptions={rowOptionsFunction}
        columns={imbursementsColumns({
          pageIndex,
          pageSize,
        })}
        data={imbursements ?? []}
        count={count ?? 0}
        colorRedKey={["wasCancelled"]}
        {...dynamicTableProps}
      />

      <ImbursementCreateModal isOpen={isOpen} onClose={onClose} />

      {editImbursement && (
        <ImbursementEditModal
          imbursement={editImbursement}
          isOpen={isEditOpen}
          onClose={onEditClose}
        />
      )}
    </>
  );
};

export default ImbursementsPage;
