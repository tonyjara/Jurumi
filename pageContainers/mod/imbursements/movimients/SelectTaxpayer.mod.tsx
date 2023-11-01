import useDebounce from "@/lib/hooks/useDebounce";
import { trpcClient } from "@/lib/utils/trpcClient";
import { ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from "@chakra-ui/react";
import type { DropdownIndicatorProps, GroupBase } from "chakra-react-select";
import { Select, components } from "chakra-react-select";
import React, { useState } from "react";

const SelectTaxpayer = ({
  setTaxPayerId,
}: {
  setTaxPayerId: React.Dispatch<React.SetStateAction<string>>;
  taxPayerId: string;
}) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [filterValue, setFilterValue] = useState("ruc");
  const [selectInput, setSelectInput] = useState("");
  const [selectOptions, setSelectOptions] = useState<
    { id: string; value: string; label: string }[] | null
  >([]);
  const debouncedSearchValue = useDebounce(selectInput, 500);

  //Full text search of the users ruc inside DB.
  const { isFetching: isFetchingFindData } =
    trpcClient.taxPayer.findFullTextSearch.useQuery(
      { searchValue: debouncedSearchValue, filterValue },
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

  const filterOptions: { value: string; label: string }[] = [
    { value: "ruc", label: "Ruc" },
    { value: "razonSocial", label: "Razón Social" },
  ];

  return (
    <Flex style={{ width: "100%", maxWidth: "500px", gap: "10px" }}>
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
            <Search2Icon h={"30px"} fontSize="lg" /> Busque por RUC o Razón
          </span>
        }
        isClearable
      />

      {filterOptions?.length && (
        <Menu>
          <MenuButton
            maxW={"250px"}
            minW={"150px"}
            whiteSpace={"normal"}
            height={"auto"}
            textAlign={"left"}
            py={{ base: "5px", md: "0px" }}
            as={Button}
            rightIcon={<ChevronDownIcon />}
          >
            Filtro:{" "}
            {filterOptions?.find((x) => x.value === filterValue)?.label ?? ""}
          </MenuButton>
          <MenuList>
            {filterOptions?.map((x) => (
              <MenuItem onClick={() => setFilterValue(x.value)} key={x.value}>
                {x.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      )}
    </Flex>
  );
};

export default SelectTaxpayer;
