import { handleUseMutationAlerts } from "@/components/Toasts & Alerts/MyToast";
import { trpcClient } from "@/lib/utils/trpcClient";
import { Stack, ButtonGroup, Button, Text } from "@chakra-ui/react";
import React from "react";

const MoneyAccountSeeds = ({ multiplier }: { multiplier: string }) => {
  const context = trpcClient.useContext();

  const { mutate: create } =
    trpcClient.seed.createMoneyAccountOffset.useMutation(
      handleUseMutationAlerts({
        successText: `Se crearon ${multiplier} ajustes.`,
        callback: () => {
          context.invalidate();
        },
      })
    );
  const handleCreateRequests = () =>
    create({ multiplier: parseInt(multiplier) });
  return (
    <Stack>
      <Text mb={"10px"} fontSize={"2xl"}>
        Crear ajustes
      </Text>
      <ButtonGroup>
        <Button
          h="full"
          whiteSpace={"break-spaces"}
          onClick={handleCreateRequests}
        >
          Solas
        </Button>
      </ButtonGroup>
    </Stack>
  );
};

export default MoneyAccountSeeds;
