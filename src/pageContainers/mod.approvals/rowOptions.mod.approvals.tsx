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
import { handleUseMutationAlerts } from '../../components/Toasts/MyToast';
import { trpcClient } from '../../lib/utils/trpcClient';
import type { MoneyRequestComplete } from './PendingApprovalsPage.mod.approvals';

const RowOptionsApprovals = ({
  x,
  hasBeenApproved,
  needsApproval,
  setRequestId,
  hasBeenRejected,
}: {
  x: MoneyRequestComplete;
  hasBeenApproved: boolean;
  hasBeenRejected: boolean;
  needsApproval: boolean;
  setRequestId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const context = trpcClient.useContext();
  const { mutate: mutateApprove } =
    trpcClient.moneyApprovals.approve.useMutation(
      handleUseMutationAlerts({
        successText: 'La solicitud ha sido aprovada!',
        callback: () => {
          context.moneyRequest.invalidate();
        },
      })
    );

  const handleApprove = () => {
    mutateApprove({ moneyRequestId: x.id });
  };
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
            isDisabled={!needsApproval || hasBeenApproved}
            onClick={handleApprove}
          >
            Aprobar
          </MenuItem>
          <MenuItem
            isDisabled={hasBeenRejected}
            onClick={() => {
              setRequestId(x.id);
            }}
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

export default RowOptionsApprovals;
