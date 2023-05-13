import { trpcClient } from "@/lib/utils/trpcClient";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";

import React, { useRef, useState } from "react";
import DeleteSeeds from "./DeleteSeeds.admin.seed";
import ImbursementSeeds from "./ImbursementSeeds.admin.seed";
import MoneyAccountSeeds from "./MoneyAccountSeeds.admin.seed";
import MoneyReqSeeds from "./MoneyReqSeeds.admin.seed";

const SeedPage = () => {
  const [multiplier, setMultiplier] = useState("1");
  const slackChannelIdRef = useRef(null);
  const { mutate } =
    trpcClient.notifications.sendSlackChannelMessage.useMutation();

  return (
    <Card>
      <CardHeader>
        <Text fontSize={"3xl"}>Seed </Text>
        <Text>
          Dejar que cada solicitud se ejecute completamente antes de empezar una
          nueva para evitar corrupción de datos{" "}
        </Text>
      </CardHeader>
      <CardBody>
        <RadioGroup mb={"20px"} onChange={setMultiplier} value={multiplier}>
          <HStack>
            <Text fontSize={"xl"}>Multiplicador</Text>
            <Radio value="1">X 1</Radio>
            <Radio value="2">X 2</Radio>
            <Radio value="5">X 5</Radio>
            <Radio value="10"> X 10</Radio>
          </HStack>
        </RadioGroup>
        <Stack spacing={10}>
          <MoneyReqSeeds multiplier={multiplier} />
          <ImbursementSeeds multiplier={multiplier} />
          <MoneyAccountSeeds multiplier={multiplier} />
          <DeleteSeeds />
        </Stack>
        <Stack mt={"20px"}>
          <Text fontSize={"2xl"}>Slack</Text>
          <Text>No olvidar invitar al bot</Text>
          <Flex>
            <Input
              ref={slackChannelIdRef}
              maxW="200px"
              name="slackChannelId"
              placeholder="Slack channel id"
            />
            <Button
              onClick={() => {
                const current = slackChannelIdRef?.current as any;
                const value = current.value as string;
                mutate({ channelId: value });
              }}
            >
              Send text to slackChannelId
            </Button>
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default SeedPage;
