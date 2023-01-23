import { ButtonDeleteDialog } from '@/components/Toasts & Alerts/button.delete.dialog';
import { handleUseMutationAlerts } from '@/components/Toasts & Alerts/MyToast';
import { trpcClient } from '@/lib/utils/trpcClient';
import { Stack, ButtonGroup, Text } from '@chakra-ui/react';
import React from 'react';

const DeleteSeeds = () => {
  const context = trpcClient.useContext();

  const { mutate: deleteALLtransactions } =
    trpcClient.seed.deleteALLTransactions.useMutation(
      handleUseMutationAlerts({
        successText: `Se eliminaron las transacciones.`,
        callback: () => {
          context.invalidate();
        },
      })
    );
  const { mutate: deleteAllMoneyReqs } =
    trpcClient.seed.deleteALLMoneyRequests.useMutation(
      handleUseMutationAlerts({
        successText: `Se eliminaron las transacciones.`,
        callback: () => {
          context.invalidate();
        },
      })
    );
  const { mutate: deleteAllExpenseReps } =
    trpcClient.seed.deleteALLExpenseReports.useMutation(
      handleUseMutationAlerts({
        successText: `Se eliminaron las rendiciones.`,
        callback: () => {
          context.invalidate();
        },
      })
    );
  const { mutate: deleteAllImbursements } =
    trpcClient.seed.deleteAllImbursements.useMutation(
      handleUseMutationAlerts({
        successText: `Se eliminaron los desembolsos.`,
        callback: () => {
          context.invalidate();
        },
      })
    );

  return (
    <Stack>
      <Text mb={'10px'} color={'red.400'} fontWeight="bold" fontSize={'2xl'}>
        Borrar
      </Text>
      <ButtonGroup>
        {/* <Button onClick={handleCreateRequests}>Transacciones</Button> */}
        <ButtonDeleteDialog
          onConfirm={() => deleteALLtransactions()}
          buttonText="Eliminar TODAS las transacciones"
          targetName="TODAS las transacciones"
        />
        <ButtonDeleteDialog
          onConfirm={() => deleteAllMoneyReqs()}
          buttonText="Eliminar TODAS las solicitudes de fondos"
          targetName="TODAS las solicitudes de fondos"
        />
        <ButtonDeleteDialog
          onConfirm={() => deleteAllExpenseReps()}
          buttonText="Eliminar TODAS las rendiciones"
          targetName="TODAS las rendiciones"
        />
        <ButtonDeleteDialog
          onConfirm={() => deleteAllImbursements()}
          buttonText="Eliminar TODOS los desembolsos"
          targetName="TODOS los desembolsos"
        />
      </ButtonGroup>
    </Stack>
  );
};

export default DeleteSeeds;
