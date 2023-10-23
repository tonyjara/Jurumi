import React from "react";
import { Text } from "@chakra-ui/react";
import { MoneyRequestComplete } from "@/pageContainers/mod/requests/mod.requests.types";

interface props {
  row: MoneyRequestComplete;
}

const OpNumberCell = ({ row }: props) => {
  //Sin proyecto SP
  //Sin siglas SS
  return (
    <Text fontSize="sm" fontWeight="bold">
      <>
        {row.project
          ? row.project.acronym
            ? row.project.acronym
            : "SS"
          : "SP"}
        -{row?.moneyOrderNumber?.toLocaleString("en-US") ?? ""}
      </>
    </Text>
  );
};

export default OpNumberCell;
