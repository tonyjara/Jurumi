import React, { useEffect, useState } from "react";
import { ColumnFilterProps } from "../ColumnFilter";
import { Prisma } from "@prisma/client";
import { Input } from "@chakra-ui/react";
import useDebounce from "@/lib/hooks/useDebounce";
import { MoneyRequestComplete } from "@/pageContainers/mod/requests/mod.requests.types";

const MoneyOrderNumberColumnFilter = ({
  setWhereFilterList,
  whereFilterList,
  keyName,
}: ColumnFilterProps) => {
  const [searchValue, setSearchValue] = useState("");

  const filterListValue = keyName
    ? whereFilterList.filter((x) => x[keyName])[0]?.[keyName].contains
    : "";

  const debouncedSearchValue = useDebounce(searchValue ?? "", 500);

  //This clears the input when the borrar filtros button is pressed
  useEffect(() => {
    if (!filterListValue?.length && debouncedSearchValue?.length) {
      setSearchValue("");
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterListValue]);

  //If the field is a number just look with anything with the number
  //If you start writing text, then look for the acronym and the number

  const whereBuilder = (val: string) => {
    const isNumber = (x: any) => !isNaN(parseInt(x ?? ""));

    if (isNumber(val)) {
      return Prisma.validator<Prisma.MoneyRequestScalarWhereInput>()({
        [keyName as string]: {
          equals: parseInt(val),
        },
      });
    }

    const acronym = val.split("-")[0];
    const moneyOrderNumberString = val.split("-")[1];
    const moneyOrderNumber = moneyOrderNumberString?.length
      ? parseInt(moneyOrderNumberString)
      : null;

    return {
      project: {
        acronym: { contains: acronym, mode: "insensitive" },
      },
      moneyOrderNumber: isNumber(moneyOrderNumber)
        ? { equals: moneyOrderNumber }
        : undefined,
    } as Prisma.MoneyRequestScalarWhereInput;
  };

  useEffect(() => {
    if (!setWhereFilterList) return;
    setWhereFilterList((prev) =>
      prev.filter((x) => !x.moneyOrderNumber && !x.project),
    );
    if (!debouncedSearchValue.length) return;

    setWhereFilterList((prev) => [...prev, whereBuilder(debouncedSearchValue)]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchValue]);

  const handleChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  return (
    <div style={{ minWidth: "130px" }} onClick={(e) => e.stopPropagation()}>
      <Input value={searchValue} size={"sm"} onChange={handleChange} />
    </div>
  );
};

export default MoneyOrderNumberColumnFilter;
