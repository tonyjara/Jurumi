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
    trpcClient.seed.createApprovedMoneyReqWithTxAndWithExpenseReport.useMutation(
      handleUseMutationAlerts({
        successText: `Se crearon ${multiplier} solicitudes aprobadas con transacciones y rendiciones.`,
        callback: () => {
          context.invalidate();
        },
      })
    );
  const { mutate: createApprovedReqsWithTxsAndExpenseReportsAndReturns } =
    trpcClient.seed.createApprovedMoneyReqWithTxAndExReportAndReturn.useMutation(
      handleUseMutationAlerts({
        successText: `Se crearon ${multiplier} solicitudes aprobadas con transacciones, rendiciones y devoluciones.`,
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
  const handleCreateApprovedReqsWithTxsAndExpenseReportsAndReturns = () =>
    createApprovedReqsWithTxsAndExpenseReportsAndReturns({
      multiplier: parseInt(multiplier),
    });

  return (
    <Stack>
      <Text mb={'10px'} fontSize={'2xl'}>
        Solicitudes
      </Text>
      <ButtonGroup>
        <Button
          h="full"
          whiteSpace={'break-spaces'}
          onClick={handleCreateRequests}
        >
          Solas
        </Button>
        <Button
          h="full"
          whiteSpace={'break-spaces'}
          onClick={handleCreateApprovedReqsWithTxs}
        >
          Aprobadas con transacciones
        </Button>
        <Button
          h="full"
          whiteSpace={'break-spaces'}
          onClick={handleCreateApprovedReqsWithTxsAndExpenseReports}
        >
          Aprobadas con transacciones y rendiciones
        </Button>
        <Button
          h="full"
          whiteSpace={'break-spaces'}
          onClick={handleCreateApprovedReqsWithTxsAndExpenseReportsAndReturns}
        >
          Aprobadas con transacciones, rendiciones y devoluciones
        </Button>
      </ButtonGroup>
    </Stack>
  );
};

export default MoneyReqSeeds;
