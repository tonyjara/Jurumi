import FormControlledSelect from "@/components/FormControlled/FormControlledSelect";
import { handleUseMutationAlerts } from "@/components/Toasts & Alerts/MyToast";
import { trpcClient } from "@/lib/utils/trpcClient";
import { FormContract } from "@/lib/validations/createContract.validate";
import { AddIcon } from "@chakra-ui/icons";
import { ChakraStylesConfig, Select } from "chakra-react-select";
import {
  Button,
  Flex,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { ContratCategories } from "@prisma/client";
import React, { useState } from "react";
import { Control, FieldErrors, UseFormSetValue } from "react-hook-form";

const ContractCategoriesSelect = ({
  control,
  errors,
  setValue,
}: {
  control: Control<FormContract>;
  errors: FieldErrors<FormContract>;
  setValue: UseFormSetValue<FormContract>;
}) => {
  const trpcContext = trpcClient.useContext();
  const [mode, setMode] = useState<"create" | "delete" | "select">("select");
  const [createValue, setCreateValue] = useState("");

  const { mutate: createContractCategory } =
    trpcClient.contracts.createContractCategory.useMutation(
      handleUseMutationAlerts({
        successText: "Categoría de contrato creada",
        callback: (data: ContratCategories) => {
          setValue("contratCategoriesId", data.id);
          setMode("select");
          setCreateValue("");
          trpcContext.invalidate();
        },
      }),
    );

  const { mutate: deleteCategory } =
    trpcClient.contracts.deleteCategoryContract.useMutation(
      handleUseMutationAlerts({
        successText: "Categoría de contrato eliminada",
        callback: () => {
          setValue("contratCategoriesId", null);
          setMode("select");
          setCreateValue("");
          trpcContext.invalidate();
        },
      }),
    );

  const handleCreateContractCategory = () => {
    createContractCategory({ name: createValue });
  };

  const { data: contractCategories } =
    trpcClient.contracts.getContractCategories.useQuery();

  const contractCatOptions = () =>
    contractCategories?.map((cat) => ({
      value: cat.id,
      label: `${cat.name}`,
    }));

  const dropDownColor = useColorModeValue("#CBD5E0", "#4A5568");
  const chakraStyles: ChakraStylesConfig = {
    dropdownIndicator: (provided: any) => ({
      ...provided,
      background: dropDownColor,
      p: 0,
      w: "40px",
    }),
  };

  return (
    <Flex w="full" flexDir={"column"}>
      <Text color={"gray.600"} _dark={{ color: "gray.400" }}>
        {" "}
        Categoría de contrato
      </Text>
      <Flex alignItems={"center"} gap={"20px"} w="full">
        {mode === "select" && (
          <FormControlledSelect
            control={control}
            errors={errors}
            name={"contratCategoriesId"}
            /* label="Categoría de contrato" */
            options={contractCatOptions() ?? []}
            /* disable={isEdit} */
            helperText={
              "Por ejemplo: 'Salarios', 'Internet', 'Contrato de suministro'"
            }
          />
        )}
        {mode === "create" && (
          <Flex mt={"10px"} w="full">
            <InputGroup>
              <InputLeftElement pointerEvents={"none"}>
                <AddIcon color={"gray.300"} />
              </InputLeftElement>
              <Input
                borderColor={"gray.300"}
                maxLength={150}
                value={createValue}
                onChange={(e) => setCreateValue(e.target.value)}
              />
            </InputGroup>
          </Flex>
        )}
        {mode === "delete" && (
          <Flex mt={"10px"} w="full">
            <Select
              instanceId={"contratCategoriesId"}
              options={contractCatOptions() ?? []}
              onChange={(e: any) => {
                if (e.value === null) return;
                deleteCategory({ id: e.value });
              }}
              chakraStyles={chakraStyles}
              noOptionsMessage={() => "No hay opciones."}
              placeholder="Seleccione la categoria que desea eliminar"
              classNamePrefix="myDropDown"
            />
          </Flex>
        )}
        <Flex gap={"10px"}>
          {mode === "select" && (
            <>
              <Button onClick={() => setMode("create")}>Crear</Button>
              <Button onClick={() => setMode("delete")}>Borrar</Button>
            </>
          )}
          {mode === "create" && (
            <Button onClick={handleCreateContractCategory}>Guardar</Button>
          )}
          {mode !== "select" && (
            <Button onClick={() => setMode("select")}>Cancelar</Button>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ContractCategoriesSelect;
