import { ChevronDownIcon, CloseIcon, Search2Icon } from "@chakra-ui/icons";
import {
    InputGroup,
    Input,
    InputRightElement,
    Text,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Flex,
    Menu,
} from "@chakra-ui/react";
import React from "react";

const TableSearchbar = ({
    searchValue,
    setSearchValue,
    type,
    placeholder,
    helperText,
    filterOptions,
}: {
    searchValue: { value: string; filter: string };
    setSearchValue: (
        value: React.SetStateAction<{ value: string; filter: string }>
    ) => void;
    type: "text" | "number";
    placeholder: string;
    helperText?: string;
    filterOptions?: { value: string; label: string }[];
}) => {
    const hasLength = !!searchValue.value.length;

    const filterLabel =
        filterOptions?.find((x) => x.value === searchValue.filter)?.label ?? "Id";

    return (
        <Flex w="100%" flexDir={{ base: "column-reverse", md: "row" }}>
            <InputGroup maxW={"200px"} flexDir={"column"}>
                <Input
                    type={type}
                    value={searchValue.value}
                    onChange={(x) =>
                        setSearchValue({ ...searchValue, value: x.target.value })
                    }
                    variant={"flushed"}
                    placeholder={placeholder + " " + filterLabel}
                />
                <InputRightElement
                    onClick={() =>
                        hasLength && setSearchValue({ ...searchValue, value: "" })
                    }
                    cursor={hasLength ? "pointer" : "auto"}
                >
                    {hasLength ? <CloseIcon /> : <Search2Icon />}
                </InputRightElement>
                <Text color={"gray.500"}>{helperText}</Text>
            </InputGroup>
            {filterOptions?.length && (
                <Menu>
                    <MenuButton
                        whiteSpace={"nowrap"}
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                    >
                        Filtro:{" "}
                        {filterOptions?.find((x) => x.value === searchValue.filter)
                            ?.label ?? ""}
                    </MenuButton>
                    <MenuList>
                        {filterOptions?.map((x) => (
                            <MenuItem
                                onClick={() => setSearchValue({ value: "", filter: x.value })}
                                key={x.value}
                            >
                                {x.label}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
            )}
        </Flex>
    );
};

export default TableSearchbar;
