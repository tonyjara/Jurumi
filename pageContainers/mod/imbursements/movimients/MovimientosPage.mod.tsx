import {
  Card,
  Tabs,
  CardHeader,
  TabList,
  Text,
  Tab,
  TabPanels,
  TabPanel,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import React, { useState } from "react";
import SelectTaxpayer from "./SelectTaxpayer.mod";
import ModExpenseReportsPage from "../../expense-reports/ModExpenseReportsPage.mod.expense-reports";
import ModMoneyRequestsPage from "../../requests/MoneyRequestsPage.mod.requests";
import ImbursementsPage from "../ImbursementsPage.mod.imbursements";

const MovimientosPage = () => {
  const [taxPayerId, setTaxPayerId] = useState<string>("");
  const backgroundColor = useColorModeValue("white", "gray.800");

  return (
    <div>
      <Card w="100%" backgroundColor={backgroundColor}>
        <Tabs overflow={"auto"}>
          <CardHeader>
            <Flex
              flexDir={{ base: "column", lg: "row" }}
              alignItems={{ base: "start", lg: "center" }}
              justifyContent="space-between"
            >
              <Text
                w="full"
                fontWeight={"bold"}
                fontSize={{ base: "2xl", md: "3xl" }}
              >
                Movimientos por contribuyente
              </Text>

              <Flex w="full" justifyContent={"center"}>
                <SelectTaxpayer
                  taxPayerId={taxPayerId}
                  setTaxPayerId={setTaxPayerId}
                />
              </Flex>

              <TabList px={"10px"}>
                <Tab>Solicitudes</Tab>
                <Tab>Rendiciones</Tab>
                <Tab>Desembolsos</Tab>
              </TabList>
            </Flex>
          </CardHeader>
          <TabPanels minH={"90vh"}>
            <TabPanel>
              {/* Solicitudes */}
              <ModMoneyRequestsPage taxPayerId={taxPayerId} />
            </TabPanel>
            <TabPanel>
              {/* Rendiciones */}
              <ModExpenseReportsPage taxPayerId={taxPayerId} />
            </TabPanel>
            <TabPanel>
              {/* Imbursements */}
              <ImbursementsPage taxPayerId={taxPayerId} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Card>
    </div>
  );
};

export default MovimientosPage;
