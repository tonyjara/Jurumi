import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import type { TableOptions } from "../DynamicTable";
import { BiWorld } from "react-icons/bi";
const TableTitleMenu = ({
    options,
    label,
    globalFilter,
}: {
    options?: TableOptions[];
    label: string | undefined;
    globalFilter?: boolean;
}) => {
    return (
        <div>
            {options?.length && (
                <Menu>
                    <MenuButton
                        fontSize={{ base: "2xl", md: "3xl" }}
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                        alignItems="center"
                        flexDir={"row"}
                        display="flex"
                        minW="250px"
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: "10px",
                            }}
                        >
                            {globalFilter && <BiWorld color="green" />}
                            {label}
                        </div>
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
