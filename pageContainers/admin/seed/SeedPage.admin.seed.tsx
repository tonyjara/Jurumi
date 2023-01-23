import {
  Card,
  CardBody,
  CardHeader,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import DeleteSeeds from './DeleteSeeds.admin.seed';
import ImbursementSeeds from './ImbursementSeeds.admin.seed';
import MoneyReqSeeds from './MoneyReqSeeds.admin.seed';

const SeedPage = () => {
  const [multiplier, setMultiplier] = useState('1');

  return (
    <Card>
      <CardHeader>
        <Text fontSize={'3xl'}>Seed </Text>
      </CardHeader>
      <CardBody>
        <RadioGroup mb={'20px'} onChange={setMultiplier} value={multiplier}>
          <HStack>
            <Text fontSize={'xl'}>Multiplicador</Text>
            <Radio value="1">X 1</Radio>
            <Radio value="2">X 2</Radio>
            <Radio value="5">X 5</Radio>
            <Radio value="10"> X 10</Radio>
          </HStack>
        </RadioGroup>
        <Stack spacing={10}>
          <MoneyReqSeeds multiplier={multiplier} />
          <ImbursementSeeds multiplier={multiplier} />
          <DeleteSeeds />
        </Stack>
      </CardBody>
    </Card>
  );
};

export default SeedPage;
