import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  useColorModeValue,
  HStack,
  Text,
  Divider,
  useDisclosure,
  Card,
  CardBody,
  CardHeader,
  Flex,
} from '@chakra-ui/react';
import type { MoneyAccount, Transaction } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import type { TableOptions } from '../../components/DynamicTables/DynamicTable';
import { useDynamicTable } from '../../components/DynamicTables/UseDynamicTable';
import ThreeDotTableButton from '../../components/DynamicTables/Utils/ThreeDotTableButton';
import CreateMoneyAccModal from '../../components/Modals/MoneyAcc.create.modal';
import EditMoneyAccModal from '../../components/Modals/moneyAcc.edit.modal';
import { formatedAccountBalance } from '../../lib/utils/TransactionUtils';
import { translateBankNames } from '../../lib/utils/TranslatedEnums';
import { trpcClient } from '../../lib/utils/trpcClient';
import TransactionsTable from '../mod.transactions/TransactionsTable';
import AccordionOptionsMoneyAccountsPage from './accordionOptions.mod.money-accounts';

export interface MoneyAccWithTransactions extends MoneyAccount {
  transactions: Transaction[];
  _count?: {
    transactions: number;
  };
}

const MoneyAccountsPage = () => {
  const [editData, setEditData] = useState<MoneyAccount | null>(null);
  const dynamicTableProps = useDynamicTable();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isMoneyAccOpen,
    onOpen: onMoneyAccOpen,
    onClose: onMoneyAccClose,
  } = useDisclosure();

  useEffect(() => {
    if (editData && !isEditOpen) {
      onEditOpen();
    }
    if (!isEditOpen && editData) {
      setEditData(null);
    }
    return () => {};
  }, [editData, isEditOpen, onEditClose, onEditOpen]);

  const { data, isFetching } =
    trpcClient.moneyAcc.getManyWithTransactions.useQuery();

  const bg = useColorModeValue('white', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.800');
  const tableOptions: TableOptions[] = [
    {
      onClick: onMoneyAccOpen,
      label: 'Crear cuenta',
    },
  ];
  return (
    <Card backgroundColor={cardBg}>
      <CardHeader>
        <Flex justifyContent={'space-between'}>
          <Flex flexDirection={'column'}>
            <Text fontSize="xl" fontWeight="bold">
              Cuentas
            </Text>
          </Flex>
          <ThreeDotTableButton options={tableOptions} />
        </Flex>
      </CardHeader>
      <CardBody>
        <Accordion
          overflow={'auto'}
          borderRadius={'8px'}
          backgroundColor={bg}
          allowToggle
        >
          {data &&
            data.map((moneyAcc) => {
              return (
                <AccordionItem key={moneyAcc.id}>
                  <AccordionButton as={Flex}>
                    <AccordionIcon />

                    <HStack minW={'600px'} h={'35px'}>
                      <Text
                        textOverflow={'ellipsis'}
                        w={'250px'}
                        overflow="hidden"
                        whiteSpace={'nowrap'}
                        fontSize={'lg'}
                      >
                        {moneyAcc.displayName}
                      </Text>
                      <Divider orientation="vertical" />
                      <Text pl={'5px'} w={'150px'} fontSize={'lg'}>
                        {moneyAcc.bankInfo
                          ? translateBankNames(moneyAcc.bankInfo?.bankName)
                          : 'Caja chica'}
                      </Text>
                      <Divider orientation="vertical" />
                      <Text
                        pl={'5px'}
                        w={'150px'}
                        fontWeight="bold"
                        fontSize={'lg'}
                      >
                        {formatedAccountBalance(moneyAcc)}
                      </Text>

                      <AccordionOptionsMoneyAccountsPage
                        setEditData={setEditData}
                        accountData={moneyAcc}
                      />
                    </HStack>
                  </AccordionButton>

                  <AccordionPanel pb={4}>
                    <TransactionsTable
                      loading={isFetching}
                      data={moneyAcc.transactions as any}
                      count={moneyAcc._count.transactions}
                      dynamicTableProps={dynamicTableProps}
                    />
                  </AccordionPanel>
                  <Divider ml={'10px'} w={'98%'} />
                </AccordionItem>
              );
            })}
        </Accordion>
        {editData && (
          <EditMoneyAccModal
            accData={editData}
            isOpen={isEditOpen}
            onClose={onEditClose}
          />
        )}
        <CreateMoneyAccModal
          isOpen={isMoneyAccOpen}
          onClose={onMoneyAccClose}
        />
      </CardBody>
    </Card>
  );
};

export default MoneyAccountsPage;
