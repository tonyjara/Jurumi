import React, { useEffect, useState } from "react";
import { ColumnFilterProps } from "../ColumnFilter";
import { Prisma } from "@prisma/client";
import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import useDebounce from "@/lib/hooks/useDebounce";
import { MdClear } from "react-icons/md";

const InputContainsColumnFilter = ({
  setWhereFilterList,
  whereFilterList,
  keyName,
  isNumber,
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

  const whereBuilder = (val: string) => {
    if (isNumber) {
      return Prisma.validator<Prisma.MoneyRequestScalarWhereInput>()({
        [keyName as string]: {
          /* contains: isNumber ? parseInt(val) : val, */
          equals: parseInt(val),
        },
      });
    }
    return Prisma.validator<Prisma.MoneyRequestScalarWhereInput>()({
      [keyName as string]: {
        /* contains: isNumber ? parseInt(val) : val, */
        contains: val,
        mode: "insensitive",
      },
    });
  };

  useEffect(() => {
    if (!setWhereFilterList) return;
    setWhereFilterList((prev) =>
      prev.filter((x) => (keyName ? !x[keyName] : true)),
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
      <InputGroup size="sm">
        <Input value={searchValue} size={"sm"} onChange={handleChange} />
        <InputRightElement
        // backgroundColor={"white"}
        // color={"black"}
        // borderRadius={"md"}
        >
          {searchValue.length > 0 && (
            <MdClear
              style={{
                cursor: "pointer",
                backgroundColor: "gray",
                color: "white",
                borderRadius: "8px",
                margin: "2px",
                fontSize: "1rem",
              }}
              onClick={() => setSearchValue("")}
            />
          )}
        </InputRightElement>
      </InputGroup>
    </div>
  );
};

export default InputContainsColumnFilter;
