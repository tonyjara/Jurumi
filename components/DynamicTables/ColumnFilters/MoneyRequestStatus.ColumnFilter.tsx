import React from "react";
import { Select } from "chakra-react-select";
import { ColumnFilterProps } from "../ColumnFilter";
import type { ChakraStylesConfig } from "chakra-react-select";
import { moneyRequestStatusOptions } from "@/lib/utils/SelectOptions";
import { useColorModeValue } from "@chakra-ui/react";
import { MoneyRequestStatus, Prisma } from "@prisma/client";
import NoSsr from "@/components/NoSsr";

const MoneyRequestStatusColumnFilter = ({
  column,
  setWhereFilterList,
  whereFilterList,
}: ColumnFilterProps) => {
  const options = moneyRequestStatusOptions;

  const dropDownColor = useColorModeValue("#CBD5E0", "#4A5568");
  const chakraStyles: ChakraStylesConfig = {
    dropdownIndicator: (provided: any) => ({
      ...provided,
      background: dropDownColor,
      p: 0,
      w: "40px",
    }),
  };

  const filterListValue = whereFilterList.filter((x) => x.status)[0]?.status;

  const whereBuilder = (val: MoneyRequestStatus) =>
    Prisma.validator<Prisma.MoneyRequestScalarWhereInput>()({
      status: val,
    });

  const handleChange = (e: any) => {
    if (!setWhereFilterList) return;

    //Return the list without the current column filter
    setWhereFilterList((prev) => prev.filter((x) => !x.status));

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

export default MoneyRequestStatusColumnFilter;
