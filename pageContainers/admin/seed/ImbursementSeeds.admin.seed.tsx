import { handleUseMutationAlerts } from '@/components/Toasts & Alerts/MyToast';
import { trpcClient } from '@/lib/utils/trpcClient';
import { Stack, ButtonGroup, Button, Text } from '@chakra-ui/react';
import React from 'react';

const ImbursementSeeds = ({ multiplier }: { multiplier: string }) => {
  const context = trpcClient.useContext();

  const { mutate: createImbursements } =
    trpcClient.seed.createImbursements.useMutation(
      handleUseMutationAlerts({
        successText: `Se crearon ${multiplier} desembolsos.`,
        callback: () => {
          context.invalidate();
        },
      })
    );

  const handleCreateImbursements = () =>
    createImbursements({ multiplier: parseInt(multiplier) });

  return (
    <Stack>
      <Text mb={'10px'} fontSize={'2xl'}>
        Desembolsos
      </Text>
      <ButtonGroup>
        <Button onClick={handleCreateImbursements}>Solos</Button>
      </ButtonGroup>
    </Stack>
  );
};

export default ImbursementSeeds;
