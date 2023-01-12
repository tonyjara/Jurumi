import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import type { MoneyAccount } from '@prisma/client';
import React from 'react';
import { BsThreeDots } from 'react-icons/bs';

const AccordionOptionsMoneyAccountsPage = ({
  setEditData,
  accountData,
}: {
  setEditData: React.Dispatch<React.SetStateAction<MoneyAccount | null>>;
  accountData: MoneyAccount;
}) => {
  return (
    <>
      <Menu>
        <MenuButton
          onClick={(e) => e.stopPropagation()}
          as={IconButton}
          aria-label="options button"
          icon={<BsThreeDots />}
        />
        <MenuList>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              setEditData(accountData);
            }}
          >
            Editar
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export default AccordionOptionsMoneyAccountsPage;
