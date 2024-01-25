import React from "react";
import { Select } from "chakra-react-select";
import { ColumnFilterProps } from "../ColumnFilter";
import type { ChakraStylesConfig } from "chakra-react-select";
import { useColorModeValue } from "@chakra-ui/react";
import { ApprovalStatus, Prisma } from "@prisma/client";
import { trpcClient } from "@/lib/utils/trpcClient";
import NoSsr from "@/components/NoSsr";
import { approvalStatusOptions } from "@/lib/utils/SelectOptions";

const MoneyRequestApprovalStatusColumnFilter = ({
  whereFilterList,
  column,
  setWhereFilterList,
}: ColumnFilterProps) => {
  const options = approvalStatusOptions;

  const dropDownColor = useColorModeValue("#CBD5E0", "#4A5568");
  const chakraStyles: ChakraStylesConfig = {
    dropdownIndicator: (provided: any) => ({
      ...provided,
      background: dropDownColor,
      p: 0,
      w: "40px",
    }),
  };

  const filterListValue = whereFilterList.filter((x) => x.approvalStatus)[0]
    ?.approvalStatus;

  const whereBuilder = (val: ApprovalStatus) =>
    Prisma.validator<Prisma.MoneyRequestScalarWhereInput>()({
      approvalStatus: val,
    });

  const handleChange = (e: any) => {
    if (!setWhereFilterList) return;

    //Return the list without the current column filter
    setWhereFilterList((prev) => prev.filter((x) => !x.approvalStatus));

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

export default MoneyRequestApprovalStatusColumnFilter;
