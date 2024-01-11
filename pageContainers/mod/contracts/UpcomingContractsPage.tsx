import {
  Accordion,
  useColorModeValue,
  Text,
  useDisclosure,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Button,
  Heading,
  ButtonGroup,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { trpcClient } from "@/lib/utils/trpcClient";
import { customScrollbar } from "styles/CssUtils";
import CreateContractModal from "@/components/Modals/Contract.create.modal";
import ContractEditModal from "@/components/Modals/Contract.edit.modal";
import { GetManyContractsType } from "./Contract.types";
import ContractsLayout from "layouts/ContractsLayout";
import ContractsAccodrionItem from "./ContractsAccordionItem";
import CreateMoneyRequestModal from "@/components/Modals/MoneyRequest.create.modal";
import { FormMoneyRequest } from "@/lib/validations/moneyRequest.validate";
import ConnectRequestToContractModal from "@/components/Modals/ConnectRequestToContract.modal";
import { contractFrequencyOptions } from "@/lib/utils/SelectOptions";

const UpcomingContractsPage = () => {
  const [editData, setEditData] = useState<GetManyContractsType | null>(null);
  const [sortBy, setSortBy] = useState<"category" | "frequency">("category");
  const [connectContractData, setConnectContractData] =
    useState<GetManyContractsType | null>(null);
  const [newRequestData, setNewRequestData] = useState<FormMoneyRequest | null>(
    null,
  );

  const { onClose: onEditClose } = useDisclosure();

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();
  const { onClose: onCreateRequestClose } = useDisclosure();

  const { data: prefs } = trpcClient.preferences.getMyPreferences.useQuery();
  const { data: contracts } =
    trpcClient.contracts.getManyWithLast100Requests.useQuery();

  const { data: contractCategories } =
    trpcClient.contracts.getContractCategories.useQuery();
  const bg = useColorModeValue("white", "gray.700");
  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <ContractsLayout>
      <Card w="100%" backgroundColor={cardBg}>
        <CardHeader>
          <Flex alignItems={"center"} gap={"20px"}>
            <Text fontWeight={"bold"} fontSize={{ base: "2xl", md: "3xl" }}>
              Contratos
            </Text>
            <Button onClick={() => onCreateOpen()} size={"sm"}>
              Nuevo contrato
            </Button>
          </Flex>
          <Flex mt={"10px"} alignItems={"center"} gap={"20px"}>
            <ButtonGroup isAttached>
              <Button
                onClick={() => setSortBy("category")}
                backgroundColor={sortBy === "category" ? "green" : undefined}
                size={"sm"}
              >
                Categoría
              </Button>
              <Button
                onClick={() => setSortBy("frequency")}
                backgroundColor={sortBy === "frequency" ? "green" : undefined}
                size={"sm"}
              >
                Frecuencia
              </Button>
            </ButtonGroup>
          </Flex>
        </CardHeader>
        <CardBody>
          <Flex flexDir={"column"} gap="20px">
            {sortBy === "category" &&
              contractCategories?.map((category) => (
                <Flex flexDir={"column"} gap={"20px"} key={category.id}>
                  <Heading size={"md"}>{category.name}</Heading>
                  <Accordion
                    borderRadius={"8px"}
                    backgroundColor={bg}
                    allowToggle
                    display={"block"}
                    /* css={customScrollbar} */
                    overflow={"hidden"}
                    w={"100%"}
                  >
                    {contracts
                      ?.filter((x) => x.contratCategoriesId === category.id)
                      .map((contract) => {
                        return (
                          <ContractsAccodrionItem
                            key={contract.id}
                            contract={contract}
                            setConnectContractData={setConnectContractData}
                            setNewRequestData={setNewRequestData}
                            setEditData={setEditData}
                          />
                        );
                      })}
                  </Accordion>
                </Flex>
              ))}
            {sortBy === "frequency" &&
              contractFrequencyOptions?.map((freq) => (
                <Flex flexDir={"column"} gap={"20px"} key={freq.value}>
                  <Heading size={"md"}>{freq.label}</Heading>
                  <Accordion
                    borderRadius={"8px"}
                    backgroundColor={bg}
                    allowToggle
                    display={"block"}
                    css={customScrollbar}
                    overflow={"auto"}
                    w={"100%"}
                  >
                    {contracts
                      ?.filter((x) => x.frequency === freq.value)
                      .map((contract) => {
                        return (
                          <ContractsAccodrionItem
                            key={contract.id}
                            contract={contract}
                            setConnectContractData={setConnectContractData}
                            setNewRequestData={setNewRequestData}
                            setEditData={setEditData}
                          />
                        );
                      })}
                  </Accordion>
                </Flex>
              ))}
          </Flex>
          {editData && (
            <ContractEditModal
              setEditData={setEditData}
              contract={editData}
              onClose={onEditClose}
            />
          )}
          {connectContractData && (
            <ConnectRequestToContractModal
              contract={connectContractData}
              onClose={() => setConnectContractData(null)}
            />
          )}
          <CreateContractModal isOpen={isCreateOpen} onClose={onCreateClose} />
        </CardBody>
      </Card>
      {prefs?.selectedOrganization && newRequestData && (
        <CreateMoneyRequestModal
          orgId={prefs.selectedOrganization}
          isOpen={!!newRequestData}
          onClose={() => {
            setNewRequestData(null);
            onCreateRequestClose();
          }}
          incomingMoneyRequest={newRequestData}
        />
      )}
    </ContractsLayout>
  );
};

export default UpcomingContractsPage;
