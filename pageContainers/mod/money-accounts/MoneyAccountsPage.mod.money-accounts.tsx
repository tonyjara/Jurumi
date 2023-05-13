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
} from "@chakra-ui/react";
import type { BankInfo, MoneyAccount, Transaction } from "@prisma/client";
import React, { useEffect, useState } from "react";
import type { TableOptions } from "@/components/DynamicTables/DynamicTable";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import ThreeDotTableButton from "@/components/DynamicTables/Utils/ThreeDotTableButton";
import CreateMoneyAccModal from "@/components/Modals/MoneyAcc.create.modal";
import EditMoneyAccModal from "@/components/Modals/moneyAcc.edit.modal";
import { formatedAccountBalance } from "@/lib/utils/TransactionUtils";
import { translateBankNames } from "@/lib/utils/TranslatedEnums";
import { trpcClient } from "@/lib/utils/trpcClient";
import TransactionsTable from "../transactions/TransactionsTable";
import AccordionOptionsMoneyAccountsPage from "./accordionOptions.mod.money-accounts";
import { customScrollbar } from "styles/CssUtils";
import LoadingPlantLottie from "@/components/Spinners-Loading/LoadiingPlantLottie";
import CreateMoneyAccountOffsetModal from "@/components/Modals/MoneyAccountOffset.create.modal";

export type MoneyAccWithTransactions = MoneyAccount & {
  bankInfo: BankInfo | null;
  _count: {
    transactions: number;
  };
  transactions: (Transaction & {
    account: {
      displayName: string;
    };
    moneyAccount: {
      displayName: string;
    } | null;
    imbursement: {
      concept: string;
    } | null;
    moneyRequest: {
      description: string;
    } | null;
    searchableImage: {
      id: string;
      url: string;
      imageName: string;
    } | null;
  })[];
};

const MoneyAccountsPage = () => {
  const [editData, setEditData] = useState<MoneyAccount | null>(null);
  const [offsetData, setOffsetData] = useState<MoneyAccWithTransactions | null>(
    null
  );
  const dynamicTableProps = useDynamicTable();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isOffsetOpen,
    onOpen: onOffsetOpen,
    onClose: onOffsetClose,
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

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData]);

  const { data, isFetching, isLoading } =
    trpcClient.moneyAcc.getManyWithTransactions.useQuery();

  const bg = useColorModeValue("white", "gray.700");
  const cardBg = useColorModeValue("white", "gray.800");
  const tableOptions: TableOptions[] = [
    {
      onClick: onMoneyAccOpen,
      label: "Crear cuenta",
    },
  ];

  return (
    <Card w="100%" backgroundColor={cardBg}>
      <CardHeader>
        <Flex justifyContent={"space-between"}>
          <Flex flexDirection={"column"}>
            <Text fontWeight={"bold"} fontSize={{ base: "2xl", md: "3xl" }}>
              Cuentas
            </Text>
          </Flex>
          <ThreeDotTableButton options={tableOptions} />
        </Flex>
      </CardHeader>
      <CardBody>
        <Accordion
          borderRadius={"8px"}
          backgroundColor={bg}
          allowToggle
          display={"block"}
          css={customScrollbar}
          overflow={"auto"}
          w={"100%"}
        >
          {data &&
            data.map((moneyAcc) => {
              return (
                <AccordionItem key={moneyAcc.id}>
                  <AccordionButton as={Flex}>
                    <AccordionIcon />

                    <HStack minW={"600px"} h={"35px"} pr="20px">
                      <Text
                        textOverflow={"ellipsis"}
                        w={"250px"}
                        overflow="hidden"
                        whiteSpace={"nowrap"}
                        fontSize={"lg"}
                      >
                        {moneyAcc.displayName}
                      </Text>
                      <Divider orientation="vertical" />
                      <Text pl={"5px"} w={"150px"} fontSize={"lg"}>
                        {moneyAcc.bankInfo
                          ? translateBankNames(moneyAcc.bankInfo?.bankName)
                          : "Caja chica"}
                      </Text>
                      <Divider orientation="vertical" />
                      <Text
                        pl={"5px"}
                        w={"150px"}
                        fontWeight="bold"
                        fontSize={"lg"}
                        whiteSpace="nowrap"
                      >
                        {formatedAccountBalance(moneyAcc)}
                      </Text>

                      <AccordionOptionsMoneyAccountsPage
                        setOffsetData={setOffsetData}
                        onOffsetOpen={onOffsetOpen}
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
                  <Divider ml={"10px"} w={"98%"} />
                </AccordionItem>
              );
            })}
        </Accordion>
        {editData && (
          <EditMoneyAccModal
            accData={editData}
            isOpen={isEditOpen}
            onClose={onEditClose}
            setEditData={setEditData}
          />
        )}
        <CreateMoneyAccModal
          isOpen={isMoneyAccOpen}
          onClose={onMoneyAccClose}
        />
        <CreateMoneyAccountOffsetModal
          moneyAccount={offsetData}
          setOffsetData={setOffsetData}
          isOpen={isOffsetOpen}
          onClose={onOffsetClose}
        />

        {(isLoading || isFetching) && <LoadingPlantLottie />}
      </CardBody>
    </Card>
  );
};

export default MoneyAccountsPage;
