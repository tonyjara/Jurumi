import { Button, useClipboard } from '@chakra-ui/react';
import React from 'react';

const CopyLinkCellButton = ({ link }: { link: string }) => {
  const { onCopy, hasCopied } = useClipboard(link);

  return (
    <>
      <Button onClick={onCopy}>{hasCopied ? 'Copiado!' : 'Copiar'}</Button>
    </>
  );
};

export default CopyLinkCellButton;
