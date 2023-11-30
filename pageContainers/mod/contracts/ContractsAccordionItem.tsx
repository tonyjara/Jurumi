import React from "react";
import { GetManyContractsType } from "./Contract.types";
import { decimalFormat } from "@/lib/utils/DecimalHelpers";
import {
  Text,
  AccordionItem,
  AccordionButton,
  Flex,
  AccordionIcon,
  HStack,
  Divider,
  AccordionPanel,
} from "@chakra-ui/react";
import ContractAccordionOptions from "./ContractAccordionOptions";
import {
  calculateContractPaymentStatus,
  calculateLastPaymentDate,
  calculateNextContractPaymentDate,
} from "./ContractsUtils";
import { FormMoneyRequest } from "@/lib/validations/moneyRequest.validate";

// Name | al dia, atrasado o por vencer | proximo pago | monto | opciones

const ContractsAccordionItem = ({
  contract,
  setEditData,
  setNewRequestData,
  setConnectContractData,
}: {
  contract: GetManyContractsType;
  setEditData: React.Dispatch<GetManyContractsType | null>;
  setNewRequestData: React.Dispatch<FormMoneyRequest | null>;
  setConnectContractData: React.Dispatch<GetManyContractsType | null>;
}) => {
  const paymentStatus = calculateContractPaymentStatus(contract);
  const nextPaymentDate = calculateNextContractPaymentDate(contract);
  const lastPaymentDate = calculateLastPaymentDate(contract);
  return (
    <AccordionItem>
      <AccordionButton as={Flex}>
        <AccordionIcon fontSize={"3xl"} mr={"10px"} />

        <Flex
          w="full"
          alignItems={"center"}
          minW={"600px"}
          h={"35px"}
          pr="20px"
        >
          <ContractAccordionOptions
            setConnectContractData={setConnectContractData}
            setNewRequestData={setNewRequestData}
            setEditData={setEditData}
            contract={contract}
          />
          <Text px={"10px"} whiteSpace={"nowrap"} fontSize={"lg"}>
            N° {contract.id}
          </Text>
          <Divider mx={"10px"} orientation="vertical" />
          <Text
            textOverflow={"ellipsis"}
            overflow="hidden"
            whiteSpace={"nowrap"}
            w={"250px"}
            fontSize={"lg"}
          >
            {contract.name}
          </Text>
          <Divider mx={"10px"} orientation="vertical" />
          <Text pl={"5px"} w={"150px"} fontSize={"lg"} whiteSpace="nowrap">
            {decimalFormat(contract.amount, contract.currency)}
          </Text>
          <Divider mx={"10px"} orientation="vertical" />
          {/* NOTE: Payment status */}
          <Text
            pl={"5px"}
            w={"150px"}
            fontSize={"lg"}
            whiteSpace="nowrap"
            color={paymentStatus.color}
          >
            {paymentStatus.text}
          </Text>
          <Divider mx={"10px"} orientation="vertical" />
          {/* NOTE: Last Payment */}
          <Text
            textOverflow={"ellipsis"}
            overflow="hidden"
            whiteSpace={"nowrap"}
            w={"250px"}
            fontSize={"lg"}
            color={paymentStatus.color}
          >
            {nextPaymentDate.text}
          </Text>
          <Divider mx={"10px"} orientation="vertical" />
          {/* NOTE: Next Payment */}
          <Text
            textOverflow={"ellipsis"}
            overflow="hidden"
            whiteSpace={"nowrap"}
            w={"250px"}
            fontSize={"lg"}
            color={lastPaymentDate.color}
          >
            {lastPaymentDate.text}
          </Text>
        </Flex>
      </AccordionButton>

      <AccordionPanel pb={4}></AccordionPanel>
      <Divider ml={"10px"} w={"98%"} />
    </AccordionItem>
  );
};

export default ContractsAccordionItem;
