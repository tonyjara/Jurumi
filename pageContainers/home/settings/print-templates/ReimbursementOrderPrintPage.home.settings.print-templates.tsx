import { decimalFormat } from "@/lib/utils/DecimalHelpers";
import { translateBankNames } from "@/lib/utils/TranslatedEnums";
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
import SignatureBox from "@/components/Print/SignatureBox";
import type { CompleteMoneyReqHome } from "../../requests/HomeRequestsPage.home.requests";
import { formatedFacturaNumber } from "@/lib/utils/FacturaUtils";

const ReimbursementOrderPrintPage = ({
    moneyRequest,
}: {
    moneyRequest: MoneyRequestComplete | CompleteMoneyReqHome | null;
}) => {
    const { data: org } = trpcClient.org.getCurrent.useQuery();
    const user = useSession().data?.user;
    const borderColor = useColorModeValue("gray.700", "gray.300");

    const req = moneyRequest ?? moneyReqCompleteMock(user?.id);

    const headerColor = useColorModeValue(
        "black",
        moneyRequest ? "black" : "white"
    );
    return (
        <Box
            justifyContent={"center"}
            alignContent="center"
            justifyItems={"center"}
            display={"block"}
            w="100%"
        // h="150vh"
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
                <Text fontSize={"2xl"}>SOLICITUD DE REEMBOLSO</Text>
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
                                <Td>{format(new Date(), "dd/MM/yy hh:mm")}</Td>
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
                                <Td fontWeight={"bold"}>Reembolsar a:</Td>
                                <Td>
                                    Denominación: {req.taxPayer?.bankInfo?.ownerName} <br />
                                    {req.taxPayer?.bankInfo?.ownerDocType}:{" "}
                                    {req.taxPayer?.bankInfo?.ownerDoc}
                                    <br />
                                    Cta: {req.taxPayer?.bankInfo?.accountNumber}
                                    <br />
                                    Banco: {translateBankNames(req.taxPayer?.bankInfo?.bankName)}
                                    <br />
                                </Td>
                            </Tr>
                            <Tr>
                                <Td fontWeight={"bold"}>Comentarios:</Td>
                                <Td whiteSpace={"break-spaces"}>{req.comments}</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
                <Text pt="20px" fontSize={"2xl"}>
                    Comprobantes adjuntos
                </Text>

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
                                <Th color={headerColor}>Factura número</Th>
                                <Th color={headerColor}>Monto</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {req.searchableImages.map((x) => (
                                <Tr key={x.id}>
                                    <Td whiteSpace={"break-spaces"}>
                                        {formatedFacturaNumber(x.facturaNumber)}
                                    </Td>
                                    <Td whiteSpace={"break-spaces"}>
                                        {decimalFormat(x.amount, x.currency)}
                                    </Td>
                                </Tr>
                            ))}
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

export default ReimbursementOrderPrintPage;
