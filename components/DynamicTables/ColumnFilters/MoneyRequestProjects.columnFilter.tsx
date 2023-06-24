import React from "react";
import { Select } from "chakra-react-select";
import { ColumnFilterProps } from "../ColumnFilter";
import type { ChakraStylesConfig } from "chakra-react-select";
import { useColorModeValue } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { trpcClient } from "@/lib/utils/trpcClient";

const MoneyRequestProjectsColumnFilter = ({
  whereFilterList,
  column,
  setWhereFilterList,
}: ColumnFilterProps) => {
  const { data } = trpcClient.project.getAllOrgProjects.useQuery();

  const options = data
    ? data.map((acc) => ({ value: acc.id, label: acc.displayName }))
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

  const filterListValue = whereFilterList.filter((x) => x.projectId)[0]
    ?.projectId;

  const whereBuilder = (val: string) =>
    Prisma.validator<Prisma.MoneyRequestScalarWhereInput>()({
      projectId: val,
    });

  const handleChange = (e: any) => {
    if (!setWhereFilterList) return;

    //Return the list without the current column filter
    setWhereFilterList((prev) => prev.filter((x) => !x.projectId));

    if (!e) return;

    setWhereFilterList((prev) => [...prev, whereBuilder(e.value)]);
  };

  return (
    <div style={{ minWidth: "130px" }} onClick={(e) => e.stopPropagation()}>
      <Select
        instanceId={column.id}
        options={options}
        onChange={handleChange}
        chakraStyles={chakraStyles}
        value={options.find((option) => option.value === filterListValue) ?? ""}
        noOptionsMessage={() => "No hay opciones."}
        size="sm"
        placeholder=""
        isClearable={true}
        classNamePrefix="myDropDown"
      />
    </div>
  );
};

export default MoneyRequestProjectsColumnFilter;
