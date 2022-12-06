import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import type { TableOptions } from '../DynamicTable';

const ThreeDotTableButton = ({ options }: { options?: TableOptions[] }) => {
  return (
    <>
      {options?.length && (
        <Menu>
          <MenuButton>
            <IconButton aria-label="options button" icon={<BsThreeDots />} />
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
    </>
  );
};

export default ThreeDotTableButton;
