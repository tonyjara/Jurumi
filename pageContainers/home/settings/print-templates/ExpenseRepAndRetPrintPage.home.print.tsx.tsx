import { decimalFormat } from "@/lib/utils/DecimalHelpers";
import { formatedFacturaNumber } from "@/lib/utils/FacturaUtils";
import {
  reduceExpenseReports,
  reduceExpenseReturns,
} from "@/lib/utils/TransactionUtils";
import { trpcClient } from "@/lib/utils/trpcClient";
import type { MoneyRequestComplete } from "@/pageContainers/mod/requests/MoneyRequestsPage.mod.requests";
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
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import React from "react";
import SignatureBox from "../../../../components/Print/SignatureBox";
import type { CompleteMoneyReqHome } from "../../requests/HomeRequestsPage.home.requests";

const ExpenseRepAndRetPringPage = ({
  moneyRequest,
}: {
  moneyRequest: MoneyRequestComplete | CompleteMoneyReqHome | null;
}) => {
  const { data: org } = trpcClient.org.getCurrent.useQuery();
  const user = useSession().data?.user;
  const borderColor = useColorModeValue("gray.700", "gray.300");
  // React to print doesnt like theme changing
  const headerColor = useColorModeValue(
    "black",
    moneyRequest ? "black" : "white"
  );

  const req = moneyRequest ?? moneyReqCompleteMock(user?.id);

  return (
    <Box
      justifyContent={"center"}
      alignContent="center"
      justifyItems={"center"}
      display={"block"}
      w="100%"
    >
      <Box mx="40px" mt={"40px"}>
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
        <Text fontSize={"2xl"}>RENDICIÓN DE FONDOS</Text>
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
                <Td>{format(new Date(), "dd/MM/yy")}</Td>
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
                <Td fontWeight={"bold"}>Comentarios:</Td>
                <Td>{req.comments}</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        {/* THIS ONE HAS ISSUES  */}
        <TableContainer
          borderColor={borderColor}
          borderWidth="1px"
          borderStyle={"solid"}
          borderRadius="8px"
          mt={"20px"}
        >
          <Table colorScheme={borderColor}>
            <Thead>
              <Tr>
                <Th color={headerColor}>Concepto</Th>
                <Th color={headerColor}>Comentarios</Th>
                <Th color={headerColor}>Factura número</Th>
                <Th color={headerColor}>Proveedor</Th>
                <Th color={headerColor}>Monto</Th>
                <Th color={headerColor}>Fecha</Th>
              </Tr>
            </Thead>
            <Tbody>
              {req.expenseReports.map((x) => (
                <Tr key={x.id}>
                  <Td whiteSpace={"break-spaces"}>{x.concept}</Td>
                  <Td whiteSpace={"break-spaces"}>{x.comments}</Td>
                  <Td whiteSpace={"break-spaces"}>
                    {formatedFacturaNumber(x.facturaNumber)}
                  </Td>
                  <Td whiteSpace={"break-spaces"}>{x.taxPayer.razonSocial}</Td>
                  <Td whiteSpace={"break-spaces"}>
                    {decimalFormat(x.amountSpent, x.currency)}
                  </Td>
                  <Td whiteSpace={"break-spaces"}>
                    {format(x.createdAt, "dd/MM/yy hh:mm")}
                  </Td>
                </Tr>
              ))}
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td>TOTAL EJECUTADO:</Td>
                <Td>
                  {decimalFormat(
                    reduceExpenseReports(req?.expenseReports),
                    req?.currency
                  )}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
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
                <Td fontWeight={"bold"}>Total solicitado:</Td>
                <Td>{decimalFormat(req.amountRequested, req.currency)}</Td>
              </Tr>
              <Tr>
                <Td fontWeight={"bold"}>Total devuelto:</Td>
                <Td>
                  {decimalFormat(
                    reduceExpenseReturns(req.expenseReturns),
                    req.currency
                  )}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <Grid
          // minW={'1000px'}
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

export default ExpenseRepAndRetPringPage;
