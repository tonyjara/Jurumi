import {
  Td,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import type { MoneyRequestComplete } from './PendingApprovalsTable';

const RowOptionsPendingApprovals = ({
  x,

  needsApproval,
}: {
  x: MoneyRequestComplete;

  needsApproval: boolean;
}) => {
  return (
    <Td>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="options button"
          icon={<BsThreeDots />}
        />
        <MenuList>
          <MenuItem
          //   isDisabled={needsApproval}
          //   onClick={() => {
          //     router.push({
          //       pathname: '/home/create/transaction',
          //       query: { moneyRequestId: x.id },
          //     });
          //   }}
          >
            {/* Aceptar y ejecutar {needsApproval && '( Necesita aprovación )'} */}
            Aprobar
          </MenuItem>
          <MenuItem
          // onClick={() => {
          //   const rejected = cloneDeep(x);
          //   rejected.status = 'REJECTED';
          //   setEditMoneyRequest(rejected);
          //   onEditOpen();
          // }}
          >
            Rechazar
          </MenuItem>

          <MenuItem>Exportar como excel</MenuItem>
          <MenuItem>Imprimir</MenuItem>
        </MenuList>
      </Menu>
    </Td>
  );
};

export default RowOptionsPendingApprovals;
