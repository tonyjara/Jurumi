import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import type { TableOptions } from "../DynamicTable";

const TableTitleMenu = ({
    options,
    label,
}: {
    options?: TableOptions[];
    label: string | undefined;
}) => {
    return (
        <div>
            {options?.length && (
                <Menu>
                    <MenuButton
                        fontSize={{ base: "2xl", md: "3xl" }}
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                    >
                        {label}
                    </MenuButton>
                    <MenuList>
                        {options.map((x) => (
                            <MenuItem key={x.label} onClick={x.onClick}>
                                {x.label}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
            )}
        </div>
    );
};

export default TableTitleMenu;
