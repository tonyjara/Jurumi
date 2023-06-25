import { useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import type {
  RowOptionsType,
  TableOptions,
} from "@/components/DynamicTables/DynamicTable";
import DynamicTable from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import TableSearchbar from "@/components/DynamicTables/Utils/TableSearchbar";
import CreateTaxPayerModal from "@/components/Modals/taxPayer.create.modal";
import EditTaxPayerModal from "@/components/Modals/taxPayer.edit.modal";
import useDebounce from "@/lib/hooks/useDebounce";
import { trpcClient } from "@/lib/utils/trpcClient";
import { taxpayersColumns } from "./columns.mod.taxpayers";
import type { FormTaxPayer } from "@/lib/validations/taxtPayer.validate";
import RowOptionsHomeTaxPayers from "./rowOptions.mod.taxpayers";

const TaxPayersPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("ruc");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [editTaxPayer, setEditTaxPayer] = useState<FormTaxPayer | null>(null);
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, setGlobalFilter, globalFilter, pageSize, sorting } =
    dynamicTableProps;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const { data: taxPayers, isFetching: isFetchingTaxPayers } =
    trpcClient.taxPayer.getMany.useQuery(
      { pageIndex, pageSize, sorting: globalFilter ? sorting : null },
      { keepPreviousData: globalFilter ? true : false }
    );
  const { data: count } = trpcClient.taxPayer.count.useQuery();
  const { data: findByIdData, isFetching: isFetchingFindData } =
    trpcClient.taxPayer.findFullTextSearch.useQuery(
      { ruc: debouncedSearchValue },
      { enabled: debouncedSearchValue.length > 4 }
    );

  const handleDataSource = () => {
    if (!taxPayers) return [];
    if (findByIdData?.length) return findByIdData;
    return taxPayers;
  };

  const tableOptions: TableOptions[] = [
    {
      onClick: onOpen,
      label: "Agregar contribuyente",
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
      <RowOptionsHomeTaxPayers
        x={x}
        onEditOpen={onEditOpen}
        setEditTaxPayer={setEditTaxPayer}
        setMenuData={setMenuData}
      />
    );
  };
  return (
    <>
      <DynamicTable
        title={"Contribuyentes"}
        searchBar={
          <TableSearchbar
            type="text"
            placeholder="Buscar por"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            filterOptions={[{ value: "ruc", label: "Ruc" }]}
          />
        }
        loading={isFetchingTaxPayers || isFetchingFindData}
        options={tableOptions}
        rowOptions={rowOptionsFunction}
        data={handleDataSource()}
        columns={taxpayersColumns({
          pageIndex,
          pageSize,
        })}
        count={count ?? 0}
        {...dynamicTableProps}
      />
      <CreateTaxPayerModal isOpen={isOpen} onClose={onClose} />

      {editTaxPayer && (
        <EditTaxPayerModal
          taxPayer={editTaxPayer}
          isOpen={isEditOpen}
          onClose={onEditClose}
        />
      )}
    </>
  );
};

export default TaxPayersPage;
