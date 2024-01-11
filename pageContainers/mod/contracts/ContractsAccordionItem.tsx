import React from "react";
import { GetManyContractsType } from "./Contract.types";
import { decimalFormat } from "@/lib/utils/DecimalHelpers";
import {
  Text,
  AccordionItem,
  AccordionButton,
  Flex,
  AccordionIcon,
  Divider,
  AccordionPanel,
} from "@chakra-ui/react";
import ContractAccordionOptions from "./ContractAccordionOptions";
import {
  calculateLastPaymentDate,
  formatContractPaymentDate,
  handleContractPaymentDayInfo,
} from "./ContractsUtils";
import { FormMoneyRequest } from "@/lib/validations/moneyRequest.validate";
import ContractMonthlyRequestsTable from "./Monthly/ContractMonthlyRequestsTable";
import { customScrollbar } from "styles/CssUtils";

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
  const formatPaymentDate = formatContractPaymentDate(contract);
  const paymentDateInfo = handleContractPaymentDayInfo(contract);
  const lastPaymentDate = calculateLastPaymentDate(contract);
  return (
    <AccordionItem>
      <AccordionButton as={Flex}>
        <AccordionIcon fontSize={"3xl"} mr={"10px"} />

        <Flex
          w="full"
          alignItems={"center"}
          overflowX={"auto"}
          overflowY={"hidden"}
          h={"35px"}
          minH={"35px"}
          /* pr="20px" */
          css={customScrollbar}
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
          {/* NOTE: Name */}
          <Text
            textOverflow={"ellipsis"}
            overflow="hidden"
            whiteSpace={"nowrap"}
            w="full"
            maxW={"200px"}
            minW={"200px"}
            fontSize={"lg"}
          >
            {contract.name}
          </Text>
          <Divider mx={"10px"} orientation="vertical" />
          {/* NOTE: Amount */}
          <Text pl={"5px"} minW={"150px"} fontSize={"lg"} whiteSpace="nowrap">
            {decimalFormat(contract.amount, contract.currency)}
          </Text>
          <Divider mx={"10px"} orientation="vertical" />
          {/* NOTE:  Payment info */}
          <Text
            textOverflow={"ellipsis"}
            overflow="hidden"
            whiteSpace={"nowrap"}
            w="full"
            minW={"150px"}
            maxW={"150px"}
            fontSize={"lg"}
            color={paymentDateInfo.color}
          >
            {paymentDateInfo.text}
          </Text>
          <Divider mx={"10px"} orientation="vertical" />
          {/* NOTE: Payment date */}
          <Text
            pl={"5px"}
            w="full"
            minW={"150px"}
            maxW={"150px"}
            fontSize={"lg"}
            whiteSpace="nowrap"
            color={formatPaymentDate.color}
          >
            {formatPaymentDate.text}
          </Text>
          <Divider mx={"10px"} orientation="vertical" />
          {/* NOTE: Last Payment */}
          <Text
            whiteSpace={"nowrap"}
            minW={"200px"}
            w="full"
            fontSize={"lg"}
            color={lastPaymentDate.color}
          >
            {lastPaymentDate.text}
          </Text>
        </Flex>
      </AccordionButton>

      <Divider ml={"10px"} w={"98%"} />
      <AccordionPanel pb={4}>
        {contract.frequency === "MONTHLY" && (
          <ContractMonthlyRequestsTable contract={contract} />
        )}
      </AccordionPanel>
    </AccordionItem>
  );
};

export default ContractsAccordionItem;
