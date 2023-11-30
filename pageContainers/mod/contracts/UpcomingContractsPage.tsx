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

const UpcomingContractsPage = () => {
  const [editData, setEditData] = useState<GetManyContractsType | null>(null);
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
    trpcClient.contracts.getManyWithLast6Requests.useQuery();

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
              Contratos por vencer o atrasados
            </Text>
            <Button onClick={() => onCreateOpen()} size={"sm"}>
              Nuevo contrato
            </Button>
          </Flex>
        </CardHeader>
        <CardBody>
          <Flex flexDir={"column"} gap="20px">
            {contractCategories?.map((category) => (
              <Flex flexDir={"column"} gap={"20px"} key={category.id}>
                <Heading size={"md"}>{category.name}</Heading>
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
