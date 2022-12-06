import { Button, Td, useClipboard } from '@chakra-ui/react';
import type { AccountVerificationLinks } from '@prisma/client';
import React from 'react';

const CopyLinkCellButton = ({
  hasBeenUsed,
  verificationLink,
}: AccountVerificationLinks) => {
  const { onCopy, hasCopied } = useClipboard(verificationLink);

  return (
    <>
      {!hasBeenUsed ? (
        <Td>
          <Button onClick={onCopy}>{hasCopied ? 'Copiado!' : 'Copiar'}</Button>
        </Td>
      ) : (
        <Td></Td>
      )}
    </>
  );
};

export default CopyLinkCellButton;
