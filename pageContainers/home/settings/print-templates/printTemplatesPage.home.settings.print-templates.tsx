import { Button, Stack } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

const PrintTemplatesPage = () => {
  return (
    <Stack>
      <Link href={'/home/settings/print-templates/fund-request'}>
        <Button>Plantilla de solicitud de fondos</Button>
      </Link>
      <Link href={'/home/settings/print-templates/expense-reps-rets'}>
        <Button>Plantilla rendición</Button>
      </Link>
      <Link href={'/home/settings/print-templates/reimbursement-order'}>
        <Button>Plantilla solicitud de reembolso</Button>
      </Link>
    </Stack>
  );
};

export default PrintTemplatesPage;
