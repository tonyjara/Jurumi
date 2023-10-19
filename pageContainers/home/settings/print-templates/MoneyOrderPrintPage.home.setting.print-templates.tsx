import { decimalFormat } from "@/lib/utils/DecimalHelpers";
import { translateBankNames } from "@/lib/utils/TranslatedEnums";
import { trpcClient } from "@/lib/utils/trpcClient";
import { moneyReqCompleteMock } from "@/__tests__/mocks/Mocks";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import SignatureBox from "@/components/Print/SignatureBox";
import { MoneyRequestComplete } from "@/pageContainers/mod/requests/mod.requests.types";
import { CompleteMoneyReqHome } from "../../requests/home.requests.types";

const MoneyOrderPrintPage = ({
  moneyRequest,
}: {
  moneyRequest: MoneyRequestComplete | CompleteMoneyReqHome | null;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: org } = trpcClient.org.getCurrent.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const memoMock = useCallback(() => {
    const mock = moneyReqCompleteMock("");

    mock.moneyOrderNumber = 1900;
    return mock;
  }, []);

  const borderColor = useColorModeValue("gray.700", "gray.300");

  const req = moneyRequest ?? memoMock();

  return !isMounted && isDev ? (
    <></>
  ) : (
    <Box
      justifyContent={"center"}
      alignContent="center"
      justifyItems={"center"}
      display={"block"}
      w="100%"
      // h="150vh"
      marginTop={"-80px"}
      transform={"scale(0.8)"}
    >
      <Box mx="40px" mt={"0px"}>
        <Flex gap={5}>
          {org?.imageLogo?.url && (
            <Image
              boxSize={"80px"}
              src={org?.imageLogo.url}
              alt="organization logo"
            />
          )}
          <Text fontSize={"6xl"}>{org?.displayName}</Text>
        </Flex>
        <Flex>
          <Text fontSize={"2xl"}>
            ORDEN DE PAGO: &quot;
            {req.project
              ? req.project.acronym
                ? req.project.acronym
                : "SS"
              : "SP"}
            -{req?.moneyOrderNumber?.toLocaleString("en-US") ?? ""}&quot;
          </Text>
        </Flex>
        <TableContainer
          borderColor={borderColor}
          borderWidth="1px"
          borderStyle={"solid"}
          borderRadius="8px"
          mt={"20px"}
        >
          <Table colorScheme={borderColor}>
            <Tbody>
              <Tr>
                <Td fontWeight={"bold"}>Responsable:</Td>
                <Td>{req.account.displayName}</Td>
              </Tr>
              <Tr>
                <Td fontWeight={"bold"}>Fecha:</Td>
                <Td>
                  {format(req.operationDate ?? new Date(), "dd/MM/yy hh:mm")}
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight={"bold"}>Motivo:</Td>
                <Td whiteSpace={"break-spaces"}>{req.description}</Td>
              </Tr>
              <Tr>
                <Td fontWeight={"bold"}>Proyecto:</Td>
                <Td>{req.project?.displayName}</Td>
              </Tr>
              <Tr>
                <Td fontWeight={"bold"}>Fuente de financiamiento:</Td>
                <Td>{req.project?.financerName}</Td>
              </Tr>
              <Tr>
                <Td fontWeight={"bold"}>Monto solicitado:</Td>
                <Td>{decimalFormat(req.amountRequested, req.currency)}</Td>
              </Tr>
              <Tr>
                <Td fontWeight={"bold"}>Pagar a favor de:</Td>
                <Td>
                  Denominación: {req.taxPayer?.bankInfo?.ownerName} <br />
                  {req.taxPayer?.bankInfo?.ownerDocType}:{" "}
                  {req.taxPayer?.bankInfo?.ownerDoc} <br />
                  Cta: {req.taxPayer?.bankInfo?.accountNumber}
                  <br /> Banco:{" "}
                  {translateBankNames(req.taxPayer?.bankInfo?.bankName)}
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight={"bold"}>Comentarios:</Td>
                <Td whiteSpace={"break-spaces"}>{req.comments}</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <Grid
          mt={"40px"}
          h="200px"
          templateRows="repeat(4, 1fr)"
          templateColumns="repeat(4, 1fr)"
          gap={4}
        >
          <GridItem colSpan={2}>
            <SignatureBox title="Presentado por:" />
          </GridItem>
          <GridItem colSpan={2}>
            <SignatureBox title="Recibí conforme:" />
          </GridItem>
          <GridItem colSpan={2}>
            <SignatureBox
              title="V° B° Director Ejecutivo:
      "
            />
          </GridItem>
          <GridItem colSpan={2}>
            <SignatureBox
              title="V° B°  Administracion:
      "
            />
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

export default MoneyOrderPrintPage;
