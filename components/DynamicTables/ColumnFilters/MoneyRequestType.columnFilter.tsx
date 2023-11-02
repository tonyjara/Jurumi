import React from "react";
import { Select } from "chakra-react-select";
import { ColumnFilterProps } from "../ColumnFilter";
import type { ChakraStylesConfig } from "chakra-react-select";
import { useColorModeValue } from "@chakra-ui/react";
import { MoneyRequestType, Prisma } from "@prisma/client";
import { moneyRequestTypeOptions } from "@/lib/utils/SelectOptions";
import NoSsr from "@/components/NoSsr";

const MoneyRequestTypeColumnFilter = ({
  column,
  whereFilterList,
  setWhereFilterList,
}: ColumnFilterProps) => {
  const options = moneyRequestTypeOptions;
  const dropDownColor = useColorModeValue("#CBD5E0", "#4A5568");
  const chakraStyles: ChakraStylesConfig = {
    dropdownIndicator: (provided: any) => ({
      ...provided,
      background: dropDownColor,
      p: 0,
      w: "40px",
    }),
  };

  const filterListValue = whereFilterList.filter((x) => x.moneyRequestType)[0]
    ?.moneyRequestType;

  const whereBuilder = (val: MoneyRequestType) =>
    Prisma.validator<Prisma.MoneyRequestScalarWhereInput>()({
      moneyRequestType: val,
    });

  const handleChange = (e: any) => {
    if (!setWhereFilterList) return;

    //Return the list without the current column filter
    setWhereFilterList((prev) => prev.filter((x) => !x.moneyRequestType));

    if (!e) return;

    setWhereFilterList((prev) => [...prev, whereBuilder(e.value)]);
  };

  return (
    <div style={{ minWidth: "130px" }} onClick={(e) => e.stopPropagation()}>
      <NoSsr>
        <Select
          instanceId={column.id}
          options={options}
          onChange={handleChange}
          chakraStyles={chakraStyles}
          //Empty string celars the select placeholder
          value={
            options.find((option) => option.value === filterListValue) ?? ""
          }
          noOptionsMessage={() => "No hay opciones."}
          size="sm"
          placeholder=""
          isClearable={true}
          classNamePrefix="myDropDown"
        />
      </NoSsr>
    </div>
  );
};

export default MoneyRequestTypeColumnFilter;
