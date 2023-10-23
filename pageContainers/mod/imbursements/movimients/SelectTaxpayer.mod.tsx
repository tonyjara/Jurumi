import { datosPyResponse } from "@/components/FormControlled/FormControlledTaxPayerId";
import useDebounce from "@/lib/hooks/useDebounce";
import { startCase } from "@/lib/utils/MyLodash";
import { trpcClient } from "@/lib/utils/trpcClient";
import { Search2Icon } from "@chakra-ui/icons";
import { Spinner } from "@chakra-ui/react";
import type { TaxPayer, TaxPayerBankInfo } from "@prisma/client";
import axios from "axios";
import type { DropdownIndicatorProps, GroupBase } from "chakra-react-select";
import { Select, components } from "chakra-react-select";
import React, { useEffect, useState } from "react";

type FetctchedTaxPayers = (TaxPayer & {
  bankInfo: TaxPayerBankInfo | null;
})[];

const SelectTaxpayer = ({
  taxPayerId,
  setTaxPayerId,
}: {
  setTaxPayerId: React.Dispatch<React.SetStateAction<string>>;
  taxPayerId: string;
}) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectInput, setSelectInput] = useState("");
  const [selectOptions, setSelectOptions] = useState<
    { id: string; value: string; label: string }[] | null
  >([]);
  const debouncedSearchValue = useDebounce(selectInput, 500);

  //Full text search of the users ruc inside DB.
  const { isFetching: isFetchingFindData } =
    trpcClient.taxPayer.findFullTextSearch.useQuery(
      { ruc: debouncedSearchValue },
      {
        refetchOnWindowFocus: false,
        enabled: debouncedSearchValue.length > 4,
        onSuccess: (taxPayers) => {
          if (!taxPayers.length) return;

          const convertToSelect = taxPayers.map((y) => ({
            id: y.id,
            value: y.ruc,
            label: y.razonSocial,
          }));

          setSelectOptions(convertToSelect);
          setOpenDropdown(true);
        },
      },
    );

  const handleInputChange = (e: any) => {
    if (openDropdown) setOpenDropdown(false);
    /* if (!selectOptions) setSelectOptions([]); */
    return e && setSelectInput(e);
  };

  const DropdownIndicator = (
    props: JSX.IntrinsicAttributes &
      DropdownIndicatorProps<unknown, boolean, GroupBase<unknown>>,
  ) => {
    return (
      <components.DropdownIndicator {...props}>
        <Spinner />
      </components.DropdownIndicator>
    );
  };

  const handleOnSelect = (
    e: any | { value: string; label: string } | undefined,
  ) => {
    setTaxPayerId(e?.id ?? "");
  };

  return (
    <div style={{ width: "100%", maxWidth: "400px" }}>
      <Select
        menuIsOpen={openDropdown}
        components={{
          DropdownIndicator: isFetchingFindData ? DropdownIndicator : undefined,
        }}
        options={selectOptions ?? []}
        onInputChange={(e) => {
          handleInputChange(e);
        }}
        onChange={(e) => handleOnSelect(e)}
        noOptionsMessage={() => "No hay opciones."}
        placeholder={
          <span>
            <Search2Icon h={"30px"} fontSize="lg" /> Ingrese un ruc y aguarde la
            busqueda
          </span>
        }
        isClearable
      />
    </div>
  );
};

export default SelectTaxpayer;
