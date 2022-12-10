import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';
import React from 'react';
import { trpcClient } from '../lib/utils/trpcClient';
import TransactionsTable from './mod.transactions/TransactionsTable';

const MoneyAccountsPage = () => {
  const { data, isFetching } =
    trpcClient.moneyAcc.getManyWithTransactions.useQuery();

  return (
    <Accordion allowToggle>
      {data?.map((moneyAcc) => (
        <AccordionItem key={moneyAcc.id}>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                {moneyAcc.displayName}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <TransactionsTable
              loading={isFetching}
              data={moneyAcc.Transactions as any}
            />
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default MoneyAccountsPage;
