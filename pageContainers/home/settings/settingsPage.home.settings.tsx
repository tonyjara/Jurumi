import { Button } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

const SettingsPage = () => {
  return (
    <div>
      Esta página aun no esta lista
      <Link href={'/home/settings/print-templates'}>
        <Button>Plantillas de impresión</Button>
      </Link>
    </div>
  );
};

export default SettingsPage;
