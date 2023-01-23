import { handleUseMutationAlerts } from '@/components/Toasts & Alerts/MyToast';
import { trpcClient } from '@/lib/utils/trpcClient';
import { Stack, ButtonGroup, Button, Text } from '@chakra-ui/react';
import React from 'react';

const MoneyReqSeeds = ({ multiplier }: { multiplier: string }) => {
  const context = trpcClient.useContext();

  const { mutate: createRequests } =
    trpcClient.seed.createMoneyRequests.useMutation(
      handleUseMutationAlerts({
        successText: `Se crearon ${multiplier} solicitudes.`,
        callback: () => {
          context.invalidate();
        },
      })
    );
  const { mutate: createApprovedReqsWithTxs } =
    trpcClient.seed.createApprovedMoneyReqWithTx.useMutation(
      handleUseMutationAlerts({
        successText: `Se crearon ${multiplier} solicitudes aprobadas con transacciones.`,
        callback: () => {
          context.invalidate();
        },
      })
    );
  const { mutate: createApprovedReqsWithTxsAndExpenseReports } =
    trpcClient.seed.createApprovedMoneyReqWithTxAndWithExpenseReturn.useMutation(
      handleUseMutationAlerts({
        successText: `Se crearon ${multiplier} solicitudes aprobadas con transacciones y rendiciones.`,
        callback: () => {
          context.invalidate();
        },
      })
    );

  const handleCreateRequests = () =>
    createRequests({ multiplier: parseInt(multiplier) });
  const handleCreateApprovedReqsWithTxs = () =>
    createApprovedReqsWithTxs({ multiplier: parseInt(multiplier) });
  const handleCreateApprovedReqsWithTxsAndExpenseReports = () =>
    createApprovedReqsWithTxsAndExpenseReports({
      multiplier: parseInt(multiplier),
    });

  return (
    <Stack>
      <Text fontSize={'2xl'}>Solicitudes</Text>
      <ButtonGroup>
        <Button onClick={handleCreateRequests}>Solas</Button>
        <Button onClick={handleCreateApprovedReqsWithTxs}>
          Aprobadas con transacciones
        </Button>
        <Button onClick={handleCreateApprovedReqsWithTxsAndExpenseReports}>
          Aprobadas con transacciones y reportes
        </Button>
      </ButtonGroup>
    </Stack>
  );
};

export default MoneyReqSeeds;
