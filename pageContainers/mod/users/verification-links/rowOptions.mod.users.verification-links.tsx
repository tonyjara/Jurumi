import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import React from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { handleUseMutationAlerts, myToast } from '@/components/Toasts/MyToast';
import { trpcClient } from '@/lib/utils/trpcClient';
import type { VerificationLinksWithAccountName } from './VerifyLinksPage.mod.users';

const RowOptionsVerificationLinks = ({
  x,
}: {
  x: VerificationLinksWithAccountName;
}) => {
  const context = trpcClient.useContext();

  const { mutate } =
    trpcClient.verificationLinks.generateVerificationLink.useMutation(
      handleUseMutationAlerts({
        successText: 'Se ha generado otro link!',
        callback: () => {
          context.verificationLinks.getVerificationLinks.invalidate();
        },
      })
    );

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="options button"
        icon={<BsThreeDots />}
      />
      <MenuList>
        <MenuItem
          onClick={() => {
            if (x.hasBeenUsed) {
              return myToast.error(
                'La cuenta ya fue activada, no puede generarse otro link.'
              );
            }
            mutate({ email: x.email, displayName: x.account.displayName });
          }}
        >
          Generar nuevo link para este correo.
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default RowOptionsVerificationLinks;