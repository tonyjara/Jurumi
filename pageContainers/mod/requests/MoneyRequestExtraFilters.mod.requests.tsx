import { Text, Flex, Checkbox } from "@chakra-ui/react";
import React from "react";

interface props {
  extraFilters: string[];
  setExtraFilters: React.Dispatch<React.SetStateAction<string[]>>;
}

const MoneyRequestExtraFilters = ({ extraFilters, setExtraFilters }: props) => {
  const radioOptions = [
    {
      value: "beingReported",
      label: "Rendición pendiente",
    },
    {
      value: "removeWasCancelled",
      label: "Remover anulados",
    },
  ];
  return (
    <Flex
      pt="20px"
      px={{
        base: "0px",
        sm: "5px",
        md: "5px",
      }}
      ml={{ base: "-5px", sm: "0px", md: "0px" }}
      gap="20px"
      display="flex"
      alignItems="center"
      flexDirection={{ base: "column", md: "row" }}
    >
      {radioOptions.map((x) => (
        <Checkbox
          name={x.value}
          size="lg"
          onChange={() => {
            if (extraFilters.includes(x.value)) {
              return setExtraFilters(extraFilters.filter((y) => y !== x.value));
            }
            setExtraFilters((prev) => [...prev, x.value]);
          }}
          isChecked={extraFilters.includes(x.value)}
          value={x.value}
          key={x.value}
          color="gray.500"
          textTransform="uppercase"
          fontWeight="bold"
          alignItems="center"
        >
          <Text fontSize="sm" overflow="hidden">
            {x.label}
          </Text>
        </Checkbox>
      ))}
    </Flex>
  );
};

export default MoneyRequestExtraFilters;
