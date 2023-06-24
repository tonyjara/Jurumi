import React, { useState } from "react";
import { Select } from "chakra-react-select";
import { ColumnFilterProps } from "../ColumnFilter";
import type { ChakraStylesConfig } from "chakra-react-select";
import { useColorModeValue } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { trpcClient } from "@/lib/utils/trpcClient";

const MoneyRequestCostCategoriesColumnFilter = ({
  column,
  setWhereFilterList,
}: ColumnFilterProps) => {
  const [selectValue, setSelectValue] = useState<any | null>(null);

  const { data } = trpcClient.project.getAllOrgCostCategories.useQuery();

  const options = data
    ? data.reduce((acc: any, val) => {
        val.costCategories.forEach((x) =>
          acc.push({ label: x.displayName, value: x.id })
        );
        return [...acc];
      }, [])
    : [];

  const dropDownColor = useColorModeValue("#CBD5E0", "#4A5568");
  const chakraStyles: ChakraStylesConfig = {
    dropdownIndicator: (provided: any) => ({
      ...provided,
      background: dropDownColor,
      p: 0,
      w: "40px",
    }),
  };

  const whereBuilder = (val: string) =>
    Prisma.validator<Prisma.MoneyRequestScalarWhereInput>()({
      costCategoryId: val,
    });

  const handleChange = (e: any) => {
    if (!setWhereFilterList) return;

    setWhereFilterList((prev) =>
      prev.filter((x) => x.costCategoryId !== selectValue)
    );
    if (!e?.value) {
      return setSelectValue(e?.value ?? null);
    }

    setWhereFilterList((prev) => [...prev, whereBuilder(e.value)]);
    setSelectValue(e?.value ?? null);
  };

  return (
    <div style={{ minWidth: "130px" }} onClick={(e) => e.stopPropagation()}>
      <Select
        instanceId={column.id}
        options={options}
        onChange={handleChange}
        chakraStyles={chakraStyles}
        value={options.find((option: any) => option.value === selectValue)}
        noOptionsMessage={() => "No hay opciones."}
        size="sm"
        placeholder=""
        isClearable={true}
        classNamePrefix="myDropDown"
      />
    </div>
  );
};

export default MoneyRequestCostCategoriesColumnFilter;
